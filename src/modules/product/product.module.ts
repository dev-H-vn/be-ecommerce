import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductHandler } from 'modules/product/commands/create-product.command';
import { GetProductHandler } from 'modules/product/queries/get-product';
import { UpdateProductHandler } from 'modules/product/commands/update-product.command';
import { ProductRepositoryModule } from 'modules/product/repositories/product.repositories';

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
