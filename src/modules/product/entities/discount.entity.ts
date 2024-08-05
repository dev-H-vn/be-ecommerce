import { AbstractEntity } from 'common/abstract.entity';
import { DiscountAppliesTo, DiscountType } from 'constant';
import { ShopEntity } from 'modules/shop/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'discounts' })
export class DiscountsEntity extends AbstractEntity {
  @Column({ type: 'varchar', default: '' })
  discountName!: string;

  @Column({ type: 'varchar', default: '' })
  discountDes!: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.FIX_AMOUNT,
  })
  discountType!: string;

  @Column({ type: 'varchar' })
  discountCode!: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  discountStartDate!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  discountEndDate!: Date;

  @Column({ type: 'numeric', default: 0 })
  discountMaxUses!: number;

  @Column({ type: 'numeric', default: 0 })
  discountUsedCount!: number;

  @Column('json', { default: [] })
  discountUsersUsed!: Record<string, any>[];

  @Column({ type: 'numeric', default: 0 })
  discountMinOder!: number;

  @OneToOne(() => ShopEntity)
  discountShop!: ShopEntity;

  @Column('boolean', { default: false })
  disCountActive!: boolean;

  @Column({
    type: 'enum',
    enum: DiscountAppliesTo,
    default: DiscountAppliesTo.ALL,
  })
  disCountAppliesTo!: string;

  @Column('uuid', { array: true, default: () => 'array[]::uuid[]' })
  disCountAppliesToIds!: Uuid[];
}
