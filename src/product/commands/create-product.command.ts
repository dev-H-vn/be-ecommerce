import { BadRequestException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'lodash';
import { ClothesEntity } from 'product/entities/clothing.entity';
import { ProductEntity } from 'product/entities/product.entity';
import { Repository } from 'typeorm';

export class CreatePostCommand implements ICommand {
  constructor(
    public readonly product: Omit<
      ProductEntity,
      'id' | 'createdAt' | 'updatedAt' | 'toDto'
    >,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler
  implements ICommandHandler<CreatePostCommand, ProductEntity>
{
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async execute(command: CreatePostCommand) {
    const { product } = command;
    return await this.productRepository.save(product);
  }
}

class Product {
  constructor(
    protected product: Omit<
      ProductEntity,
      'id' | 'createdAt' | 'updatedAt' | 'toDto'
    >,
    @InjectRepository(ProductEntity)
    protected productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(): Promise<ProductEntity> {
    return this.productRepository.save(this.product);
  }
}

class Clothes extends Product {
  constructor(
    product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt' | 'toDto'>,
    @InjectRepository(ProductEntity)
    productRepository: Repository<ProductEntity>,
    @InjectRepository(ClothesEntity)
    private clothesRepository: Repository<ClothesEntity>,
  ) {
    super(product, productRepository);
  }

  async createProduct(): Promise<ProductEntity> {
    const newClothes = await this.clothesRepository.save(
      this.product.productAttributes, // Ensure 'productAttributes' is defined in `product`
    );
    if (!newClothes)
      throw new BadRequestException('Failed to create new clothes.');

    const newProduct = await super.createProduct(); // Use `super.createProduct` to call base class method
    if (!newProduct)
      throw new BadRequestException('Failed to create new product.');

    return newProduct;
  }
}
