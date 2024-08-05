import { BadRequestException, Inject } from '@nestjs/common';
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
import { ProductRepositories } from 'modules/product/repositories/product.repositories';

export class UpdateProductCommand implements ICommand {
  constructor(public readonly product: IProduct) {}
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand, ProductEntity>
{
  constructor(
    @Inject('PRODUCT_REPOSITORIES')
    private repositories: ProductRepositories,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductEntity> {
    const { product } = command;
    const { productType } = product;

    switch (productType) {
      case Category.Electronic:
        return new Electronic(product, this.repositories).updateProduct();
      case Category.Clothes:
        return new Clothes(product, this.repositories).updateProduct();
      default:
        throw new BadRequestException(`Invalid product ${productType}`);
    }
  }
}
