import { BadRequestException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';

export class CreateProductCommand implements ICommand {
  constructor(
    public readonly type: string,
    public readonly product: Omit<
      ProductEntity,
      'id' | 'createdAt' | 'updatedAt' | 'toDto'
    >,
  ) {}
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
    const { product, type } = command;

    switch (type) {
      case 'Electronic':
        return new Electronic(
          product,
          this.productRepository,
          this.electroRepository,
        ).createProduct();
      case 'Clothes':
        return new Clothes(
          product,
          this.productRepository,
          this.clothesRepository,
        ).createProduct();
      default:
        throw new BadRequestException(`Invalid product ${type}`);
    }
  }
}

class Product {
  protected product: Omit<
    ProductEntity,
    'id' | 'createdAt' | 'updatedAt' | 'toDto'
  >;
  protected productRepository: Repository<ProductEntity>;

  constructor(
    product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt' | 'toDto'>,
    productRepository: Repository<ProductEntity>,
  ) {
    this.product = product;
    this.productRepository = productRepository;
  }

  async createProduct(): Promise<ProductEntity> {
    return this.productRepository.save(this.product);
  }
}

class Clothes extends Product {
  private clothesRepository: Repository<ClothesEntity>;

  constructor(
    product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt' | 'toDto'>,
    productRepository: Repository<ProductEntity>,
    clothesRepository: Repository<ClothesEntity>,
  ) {
    super(product, productRepository);
    this.clothesRepository = clothesRepository;
  }

  async createProduct(): Promise<ProductEntity> {
    await this.clothesRepository.save(this.product.productAttributes);
    const newProduct = await super.createProduct();
    return newProduct;
  }
}

class Electronic extends Product {
  private electroRepository: Repository<ElectronicEntity>;

  constructor(
    product: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt' | 'toDto'>,
    productRepository: Repository<ProductEntity>,
    electroRepository: Repository<ElectronicEntity>,
  ) {
    super(product, productRepository);
    this.electroRepository = electroRepository;
  }

  async createProduct(): Promise<ProductEntity> {
    console.log(
      '🐉 ~ Electronic ~ createProduct ~ this.product.productAttributes ~ 🚀\n',
      this.product.productAttributes,
    );
    await this.electroRepository.save(this.product.productAttributes);

    const newProduct = await super.createProduct();
    return newProduct;
  }
}
