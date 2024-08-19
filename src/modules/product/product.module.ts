import { Module } from '@nestjs/common';
import { CreateProductHandler } from 'modules/product/commands/create-product.command';
import { UpdateProductHandler } from 'modules/product/commands/update-product.command';
import { GetProductHandler } from 'modules/product/queries/get-product';
import { ProductRepositoryModule } from 'modules/product/repositories/product.repositories';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

const handlers = [
  CreateProductHandler,
  UpdateProductHandler,
  GetProductHandler,
];

@Module({
  imports: [ProductRepositoryModule.forRoot()],
  controllers: [ProductController],
  providers: [ProductService, ...handlers],
})
export class ProductModule {}
