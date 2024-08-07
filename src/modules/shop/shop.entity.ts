import { AbstractEntity } from 'common/abstract.entity';
import { UseDto } from 'decorators';
import { CardsEntity } from 'modules/card/entities/card.entity';
import { InventoriesEntity } from 'modules/product/entities/inventories.entity';
import { ShopDto } from 'modules/shop/dto/shop.dto';
import { Column, Entity, OneToOne } from 'typeorm';

// @UseDto(ShopDto)
@Entity({ name: 'shops' })
export class ShopEntity extends AbstractEntity<ShopDto> {
  @Column({ type: 'varchar' })
  shopName!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @OneToOne(() => CardsEntity, (user) => user.cardUser)
  card!: CardsEntity;
}
