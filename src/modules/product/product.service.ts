import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from 'modules/product/commands/create-product.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import {
  ProductPageOptionsDto,
  UsersPageOptionsDto,
} from 'modules/user/dtos/users-page-options.dto';
import { GetProductQuery } from 'modules/product/queries/get-product';
import { PageDto } from 'common/dto/page.dto';
import { UpdateProductCommand } from 'modules/product/commands/update-product.command';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import { ProductRepositories } from 'modules/product/repositories/product.repositories';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORIES')
    private repositories: ProductRepositories,
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(req: RequestType, createProductDto: CreateProductDto) {
    const id = uuidV4() as Uuid;
    const data = {
      ...createProductDto,
      id,
      productOwner: req.clientId,
      productAttributes: {
        ...createProductDto.productAttributes,
        id,
        productOwner: req.clientId,
      },
    };

    const resp = await this.commandBus.execute<CreateProductCommand>(
      new CreateProductCommand(data),
    );
    return resp;
  }

  async update(req: RequestType, updateProductDto: UpdateProductDto) {
    const data = {
      ...updateProductDto,
      productOwner: req.clientId,
      productAttributes: {
        ...updateProductDto.productAttributes,
        productOwner: req.clientId,
        id: updateProductDto.id,
      },
    };

    const resp = await this.commandBus.execute<UpdateProductCommand>(
      new UpdateProductCommand(data),
    );
    return resp;
  }

  async findAllProductOfTheShop(
    req: RequestType,
    pageOptionsDto: ProductPageOptionsDto,
  ): Promise<PageDto<ProductEntity>> {
    const { clientId } = req;

    const getProductQuery = new GetProductQuery(pageOptionsDto, clientId);
    const resp = await this.queryBus.execute(getProductQuery);
    return resp;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async publishProductByShop(req: RequestType, id: Uuid) {
    console.log('🐉 ~ ProductService ~ publishProductByShop ~ id ~ 🚀\n', id);
    const { clientId } = req;
    try {
      if (!id) throw new BadRequestException('ProductId must be provide!');
      const foundProduct = await this.repositories.productRepository.findOneBy({
        id,
      });
      if (!foundProduct) throw new BadRequestException('Product not found!');

      if (!foundProduct.isDraft && foundProduct.isPublish) {
        throw new BadRequestException('Product was published!');
      }
      const resp = await this.repositories.productRepository.update(
        { id: foundProduct.id },
        { isDraft: false, isPublish: true },
      );
      if (resp.affected && resp.affected > 0) {
        return 'Product is published.';
      }
    } catch (error: any) {
      if (error.message) throw new BadRequestException(error.message);
    }
  }

  async draftProductByShop(req: RequestType, id: Uuid) {
    console.log('🐉 ~ ProductService ~ publishProductByShop ~ id ~ 🚀\n', id);
    const { clientId } = req;
    try {
      if (!id) throw new BadRequestException('ProductId must be provide!');
      const foundProduct = await this.repositories.productRepository.findOneBy({
        id,
      });
      if (!foundProduct) throw new BadRequestException('Product not found!');

      if (foundProduct.isDraft && !foundProduct.isPublish) {
        throw new BadRequestException('Product was drafted!');
      }
      const resp = await this.repositories.productRepository.update(
        { id: foundProduct.id },
        { isDraft: true, isPublish: false },
      );
      if (resp.affected && resp.affected > 0) {
        return 'Product is drafted.';
      }
    } catch (error: any) {
      if (error.message) throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
