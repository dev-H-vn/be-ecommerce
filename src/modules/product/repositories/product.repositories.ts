import { DynamicModule, Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import { InventoriesEntity } from 'modules/product/entities/inventories.entity';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { Repository } from 'typeorm';

const productEntity = [
  ProductEntity,
  ClothesEntity,
  ElectronicEntity,
  InventoriesEntity,
];

export interface ProductRepositories {
  productRepository: Repository<ProductEntity>;
  clothesRepository: Repository<ClothesEntity>;
  electroRepository: Repository<ElectronicEntity>;
  inventoriesRepository: Repository<InventoriesEntity>;
}

@Module({})
export class ProductRepositoryModule {
  static forRoot(): DynamicModule {
    return {
      module: ProductRepositoryModule,
      imports: [TypeOrmModule.forFeature(productEntity)],
      providers: [
        {
          provide: 'PRODUCT_REPOSITORIES',
          useFactory: (
            productRepository: Repository<ProductEntity>,
            clothesRepository: Repository<ClothesEntity>,
            electroRepository: Repository<ElectronicEntity>,
            inventoriesRepository: Repository<InventoriesEntity>,
          ) => ({
            productRepository,
            clothesRepository,
            electroRepository,
            inventoriesRepository,
          }),
          inject: [
            getRepositoryToken(ProductEntity),
            getRepositoryToken(ClothesEntity),
            getRepositoryToken(ElectronicEntity),
            getRepositoryToken(InventoriesEntity),
          ],
        },
      ],
      exports: ['PRODUCT_REPOSITORIES'],
    };
  }
}
