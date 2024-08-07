import { IsDefined, ValidateIf, IsArray } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { CardStatus, RoleType } from 'constant';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { ShopEntity } from 'modules/shop/shop.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'cards' })
export class CardsEntity extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: CardStatus,
    default: CardStatus.ACTIVE,
  })
  cardState!: string;

  @Column('json', { default: [] })
  discountUsersUsed!: ProductEntity[];

  @Column('numeric')
  cardCountProducts!: number;

  @OneToOne(() => ShopEntity, (user) => user.card, { onDelete: 'CASCADE' })
  @JoinColumn()
  cardUser!: ShopEntity;
}
