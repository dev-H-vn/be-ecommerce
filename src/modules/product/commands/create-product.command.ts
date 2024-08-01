import { BadRequestException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import {
  Clothes,
  Electronic,
  IProduct,
} from 'modules/product/commands/product.class';
import { Category } from 'constant';

export class CreateProductCommand implements ICommand {
  constructor(public readonly product: IProduct) {}
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, ProductEntity>
{
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ClothesEntity)
    private clothesRepository: Repository<ClothesEntity>,
    @InjectRepository(ElectronicEntity)
    private electroRepository: Repository<ElectronicEntity>,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    const { product } = command;
    const { productType } = product;

    switch (productType) {
      case Category.Electronic:
        return new Electronic(
          product,
          this.productRepository,
          this.electroRepository,
        ).createProduct();
      case Category.Clothes:
        return new Clothes(
          product,
          this.productRepository,
          this.clothesRepository,
        ).createProduct();
      default:
        throw new BadRequestException(`Invalid product ${productType}`);
    }
  }
}
