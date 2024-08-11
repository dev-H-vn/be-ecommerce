import { Module, DynamicModule } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CartsEntity } from 'modules/cart/entities/cart.entity';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';
import { OrderEntity } from 'modules/order/entities/order.entity';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import { InventoriesEntity } from 'modules/product/entities/inventories.entity';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ShopEntity } from 'modules/shop/shop.entity';

import { Repository } from 'typeorm';

const ordersEntity = [
  ProductEntity,
  OrderEntity,
  ShopEntity,
  CartsEntity,
  DiscountsEntity,
];

export interface OrdersRepositories {
  productRepository: Repository<ProductEntity>;
  orderRepository: Repository<OrderEntity>;
  shopRepository: Repository<ShopEntity>;
  cartRepository: Repository<CartsEntity>;
  discountRepository: Repository<DiscountsEntity>;
}

@Module({})
export class OrdersRepositoriesModule {
  static forRoot(): DynamicModule {
    return {
      module: OrdersRepositoriesModule,
      imports: [TypeOrmModule.forFeature(ordersEntity)],
      providers: [
        {
          provide: 'ORDERS_REPOSITORIES',
          useFactory: (
            productRepository: Repository<ProductEntity>,
            orderRepository: Repository<OrderEntity>,
            shopRepository: Repository<ShopEntity>,
            cartRepository: Repository<CartsEntity>,
            discountRepository: Repository<DiscountsEntity>,
          ) => ({
            productRepository,
            orderRepository,
            shopRepository,
            cartRepository,
            discountRepository,
          }),
          inject: [
            getRepositoryToken(ProductEntity),
            getRepositoryToken(OrderEntity),
            getRepositoryToken(ShopEntity),
            getRepositoryToken(CartsEntity),
            getRepositoryToken(DiscountsEntity),
          ],
        },
      ],
      exports: ['ORDERS_REPOSITORIES'],
    };
  }
}
