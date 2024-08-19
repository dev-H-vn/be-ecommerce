import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { CreateProductDto } from 'modules/product/dto/create-product.dto';
import type { UpdateProductDto } from 'modules/product/dto/update-product.dto';
import type { ProductEntity } from 'modules/product/entities/product.entity';
import type { ProductRepositories } from 'modules/product/repositories/product.repositories';

export type IProduct = CreateProductDto &
  UpdateProductDto & { productOwner: Uuid; productAttributes: { id: Uuid } };

export class Product {
  protected product: IProduct;

  protected repositories: ProductRepositories;

  constructor(product: IProduct, repositories: ProductRepositories) {
    this.product = product;
    this.repositories = repositories;
  }

  async createProduct(): Promise<ProductEntity> {
    const product = await this.repositories.productRepository.save(
      this.product,
    );

    if (product) {
      await this.repositories.inventoriesRepository.save({
        id: product.id,
        // inventoryLocation: '',
        // inventoryShop: product.productOwner,
        inventoryStock: product.productQuantity,
      });
    }

    return product;
  }

  async updateProduct(): Promise<ProductEntity> {
    if (!this.product.id) {
      throw new BadRequestException('ProductId not found!');
    }

    const foundProduct = await this.repositories.productRepository.findOneBy({
      id: this.product.id,
      productOwner: this.product.productOwner,
    });

    if (!foundProduct) {
      throw new NotFoundException('Product not found!');
    }

    return await this.repositories.productRepository.save(this.product);
  }
}

export class Clothes extends Product {
  constructor(product: IProduct, repositories: ProductRepositories) {
    super(product, repositories);
  }

  async createProduct(): Promise<ProductEntity> {
    const category = await this.repositories.clothesRepository.save(
      this.product.productAttributes,
    );

    if (!category) {
      throw new BadRequestException('Category not created!');
    }

    return await super.createProduct();
  }

  async updateProduct(): Promise<ProductEntity> {
    if (!this.product.id) {
      throw new BadRequestException('ProductId not found!');
    }

    if (this.product.id !== this.product.productAttributes.id) {
      throw new BadRequestException('ProductType incorrect!');
    }

    const foundCategory = await this.repositories.clothesRepository.findOneBy({
      id: this.product.productAttributes.id,
      productOwner: this.product.productOwner,
    });

    if (!foundCategory) {
      throw new NotFoundException('Category not found!');
    }

    await this.repositories.clothesRepository.save(
      this.product.productAttributes,
    );

    return await super.updateProduct();
  }
}

export class Electronic extends Product {
  constructor(product: IProduct, repositories: ProductRepositories) {
    super(product, repositories);
  }

  async createProduct(): Promise<ProductEntity> {
    const category = await this.repositories.electroRepository.save(
      this.product.productAttributes,
    );

    if (!category) {
      throw new BadRequestException('Category not created!');
    }

    return await super.createProduct();
  }

  async updateProduct(): Promise<ProductEntity> {
    if (!this.product.id) {
      throw new BadRequestException('ProductId not found!');
    }

    if (this.product.id !== this.product.productAttributes.id) {
      throw new BadRequestException('ProductType incorrect!');
    }

    const foundCategory = await this.repositories.electroRepository.findOneBy({
      id: this.product.productAttributes.id,
      productOwner: this.product.productOwner,
    });

    if (!foundCategory) {
      throw new NotFoundException('Category not found!');
    }

    await this.repositories.electroRepository.save(
      this.product.productAttributes,
    );

    return await super.updateProduct();
  }
}
