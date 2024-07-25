import { AbstractEntity } from 'common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  productOwner!: Uuid;

  @Column({ type: 'varchar' })
  productName!: string;

  @Column({ type: 'varchar' })
  productThumb!: string;

  @Column({ type: 'varchar' })
  productDescription!: string;

  @Column({ type: 'varchar' })
  productPrice!: number;

  @Column({ type: 'varchar' })
  productQuantity!: number;

  @Column({ type: 'varchar' })
  productType!: string;

  @Column({ type: 'varchar' })
  productAttributes!: any;
}
