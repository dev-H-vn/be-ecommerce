import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
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

  async update(req: RequestType, createProductDto: CreateProductDto) {
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
      const foundProduct = await this.productRepository.findOneBy({ id });
      if (!foundProduct) throw new BadRequestException('Product not found!');

      if (!foundProduct.isDraft && foundProduct.isPublish) {
        throw new BadRequestException('Product was published!');
      }
      const resp = await this.productRepository.update(
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
      const foundProduct = await this.productRepository.findOneBy({ id });
      if (!foundProduct) throw new BadRequestException('Product not found!');

      if (foundProduct.isDraft && !foundProduct.isPublish) {
        throw new BadRequestException('Product was drafted!');
      }
      const resp = await this.productRepository.update(
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