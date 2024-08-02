import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from 'modules/product/dto/create-product.dto';
import { UpdateProductDto } from 'modules/product/dto/update-product.dto';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { Repository } from 'typeorm';

export type IProduct = CreateProductDto &
  UpdateProductDto & { productOwner: Uuid; productAttributes: { id: Uuid } };

export class Product {
  protected product: IProduct;
  protected productRepository: Repository<ProductEntity>;

  constructor(product: IProduct, productRepository: Repository<ProductEntity>) {
    this.product = product;
    this.productRepository = productRepository;
  }

  async createProduct(): Promise<ProductEntity> {
    return await this.productRepository.save(this.product);
  }

  async updateProduct(): Promise<ProductEntity> {
    if (!this.product.id) {
      throw new BadRequestException('ProductId not found!');
    }
    const foundProduct = await this.productRepository.findOneBy({
      id: this.product.id,
      productOwner: this.product.productOwner,
    });
    if (!foundProduct) throw new NotFoundException('Product not found!');
    return await this.productRepository.save(this.product);
  }
}

export class Clothes extends Product {
  private clothesRepository: Repository<ClothesEntity>;

  constructor(
    product: IProduct,
    productRepository: Repository<ProductEntity>,
    clothesRepository: Repository<ClothesEntity>,
  ) {
    super(product, productRepository);
    this.clothesRepository = clothesRepository;
  }

  async createProduct(): Promise<ProductEntity> {
    const category = await this.clothesRepository.save(
      this.product.productAttributes,
    );
    if (!category) throw new BadRequestException('Category not created!');
    const newProduct = await super.createProduct();
    return newProduct;
  }

  async updateProduct(): Promise<ProductEntity> {
    if (!this.product.id) {
      throw new BadRequestException('ProductId not found!');
    }
    if (this.product.id !== this.product.productAttributes.id) {
      throw new BadRequestException('ProductType incorrect!');
    }
    const foundCategory = await this.clothesRepository.findOneBy({
      id: this.product.productAttributes.id,
      productOwner: this.product.productOwner,
    });
    if (!foundCategory) throw new NotFoundException('Category not found!');
    await this.clothesRepository.save(this.product.productAttributes);
    const newProduct = await super.updateProduct();
    return newProduct;
  }
}

export class Electronic extends Product {
  private electroRepository: Repository<ElectronicEntity>;

  constructor(
    product: IProduct,
    productRepository: Repository<ProductEntity>,
    electroRepository: Repository<ElectronicEntity>,
  ) {
    super(product, productRepository);
    this.electroRepository = electroRepository;
  }

  async createProduct(): Promise<ProductEntity> {
    const category = await this.electroRepository.save(
      this.product.productAttributes,
    );
    if (!category) throw new BadRequestException('Category not created!');
    const newProduct = await super.createProduct();
    return newProduct;
  }

  async updateProduct(): Promise<ProductEntity> {
    if (!this.product.id) {
      throw new BadRequestException('ProductId not found!');
    }
    if (this.product.id !== this.product.productAttributes.id) {
      throw new BadRequestException('ProductType incorrect!');
    }
    const foundCategory = await this.electroRepository.findOneBy({
      id: this.product.productAttributes.id,
      productOwner: this.product.productOwner,
    });
    if (!foundCategory) throw new NotFoundException('Category not found!');
    await this.electroRepository.save(this.product.productAttributes);
    const newProduct = await super.updateProduct();
    return newProduct;
  }
}
