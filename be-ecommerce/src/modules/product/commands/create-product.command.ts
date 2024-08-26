import { BadRequestException, Inject } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { Category } from 'constant';
import {
  Clothes,
  Electronic,
  IProduct,
} from 'modules/product/commands/product.class';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ProductRepositories } from 'modules/product/repositories/product.repositories';

export class CreateProductCommand implements ICommand {
  constructor(public readonly product: IProduct) {}
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, ProductEntity>
{
  constructor(
    @Inject('PRODUCT_REPOSITORIES')
    private repositories: ProductRepositories,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    const { product } = command;
    const { productType } = product;

    switch (productType) {
      case Category.Electronic: {
        return new Electronic(product, this.repositories).createProduct();
      }

      case Category.Clothes: {
        return new Clothes(product, this.repositories).createProduct();
      }

      default: {
        throw new BadRequestException(`Invalid product ${productType}`);
      }
    }
  }
}
