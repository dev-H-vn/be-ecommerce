import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from 'modules/product/commands/create-product.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { UsersPageOptionsDto } from 'modules/user/dtos/users-page-options.dto';
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
    const id = uuidV4();
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

    const type = 'Electronic';
    const resp = await this.commandBus.execute<CreateProductCommand>(
      new CreateProductCommand(type, data),
    );
    return resp;
  }

  async findAllProductOfTheShop(
    req: RequestType,
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<ProductEntity>> {
    const { clientId } = req;

    const getProductQuery = new GetProductQuery(pageOptionsDto, clientId);
    const resp = await this.queryBus.execute(getProductQuery);
    return resp;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
