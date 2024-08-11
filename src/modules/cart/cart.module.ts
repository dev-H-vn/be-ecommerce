import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsEntity } from 'modules/cart/entities/cart.entity';
import { ProductEntity } from 'modules/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartsEntity, ProductEntity])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
