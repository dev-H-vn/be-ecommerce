import { AbstractEntity } from 'common/abstract.entity';
import { CartStatus } from 'constant';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { UserEntity } from 'modules/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'carts' })
export class CartsEntity extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  cardState!: CartStatus;

  @Column('json', { default: [] })
  cardProducts!: Array<Partial<ProductEntity>>;

  @Column('numeric', { default: 0 })
  cardCountProducts!: number;

  @Column('uuid')
  cardUserId!: Uuid;

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  cardUser!: UserEntity;
}
