import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from 'product/entities/product.entity';
import { ClothesEntity } from 'product/entities/clothing.entity';
import { ElectronicEntity } from 'product/entities/electronic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const productEntity = [ProductEntity, ClothesEntity, ElectronicEntity];
@Module({
  imports: [TypeOrmModule.forFeature(productEntity)],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
