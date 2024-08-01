import { BadRequestException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import { CreateProductDto } from 'modules/product/dto/create-product.dto';
import {
  Clothes,
  Electronic,
  IProduct,
} from 'modules/product/commands/product.class';
import { UpdateProductDto } from 'modules/product/dto/update-product.dto';
import { Category } from 'constant';

export class UpdateProductCommand implements ICommand {
  constructor(
    public readonly type: string,
    public readonly product: IProduct,
  ) {}
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand, ProductEntity>
{
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ClothesEntity)
    private clothesRepository: Repository<ClothesEntity>,
    @InjectRepository(ElectronicEntity)
    private electroRepository: Repository<ElectronicEntity>,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductEntity> {
    const { product, type } = command;

    switch (type) {
      case Category.Electronic:
        return new Electronic(
          product,
          this.productRepository,
          this.electroRepository,
        ).updateProduct();
      case Category.Clothes:
        return new Clothes(
          product,
          this.productRepository,
          this.clothesRepository,
        ).updateProduct();
      default:
        throw new BadRequestException(`Invalid product ${type}`);
    }
  }
}
