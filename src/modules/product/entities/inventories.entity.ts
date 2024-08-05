import { AbstractEntity } from 'common/abstract.entity';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ShopEntity } from 'modules/shop/shop.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'inventories' })
export class InventoriesEntity extends AbstractEntity {
  @OneToOne(() => ProductEntity)
  @JoinColumn()
  inventoryProduct!: ProductEntity;

  @Column({ type: 'varchar', default: '' })
  inventoryLocation!: string;

  @Column({ type: 'numeric' })
  inventoryStock!: number;

  @OneToOne(() => ShopEntity)
  inventoryShop!: ShopEntity;

  @Column('json', { default: {} })
  inventoryReservations!: Record<string, any>;
}
