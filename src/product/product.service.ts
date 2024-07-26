import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from 'product/commands/create-product.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'product/entities/product.entity';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private commandBus: CommandBus,
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
    console.log('🐉 ~ ProductService ~ create ~ data ~ 🚀\n', data);

    const type = 'Electronic';
    const resp = await this.commandBus.execute<CreateProductCommand>(
      new CreateProductCommand(type, data),
    );

    return resp;
  }

  findAll() {
    return `This action returns all product`;
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
