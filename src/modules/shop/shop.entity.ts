import { AbstractEntity } from 'common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'shops' })
export class ShopEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  shopName!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar' })
  refreshToken!: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;
}
