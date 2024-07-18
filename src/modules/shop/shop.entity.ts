import { AbstractEntity } from 'common/abstract.entity';
import { UseDto } from 'decorators';
import { ShopDto } from 'modules/shop/dto/shop.dto';
import { Column, Entity } from 'typeorm';

@UseDto(ShopDto)
@Entity({ name: 'shops' })
export class ShopEntity extends AbstractEntity<ShopDto> {
  @Column({ type: 'varchar' })
  shopName!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar' })
  refreshToken!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;
}
