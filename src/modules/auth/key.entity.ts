import { IsDefined, ValidateIf } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { RoleType } from 'constant';
import { ShopEntity } from 'modules/shop/shop.entity';
import { UserEntity } from 'modules/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'keys' })
export class KeyEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  ownerId!: Uuid;

  @OneToOne(() => ShopEntity, (ShopEntity) => ShopEntity.id)
  @JoinColumn({ name: 'owner', referencedColumnName: 'owner_id' })
  owner!: ShopEntity | UserEntity;

  @Column({ type: 'varchar' })
  publicKey!: string;

  @ValidateIf((o) => !RoleType.SHOP && !RoleType.USER)
  @IsDefined({ message: 'At least one of USER or SHOP must be provided' })
  @Column({ type: 'varchar' })
  role!: RoleType;

  @Column({ type: 'varchar' })
  refreshToken!: string;

  @Column({ type: 'varchar', array: true })
  refreshTokenUsed!: string[];
}
