import { IsDefined, ValidateIf } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { RoleType } from 'constant';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'keys' })
export class KeyEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  ownerId!: Uuid;

  @Column({ type: 'varchar' })
  publicKey!: string;

  @ValidateIf((o) => !RoleType.SHOP && !RoleType.USER)
  @IsDefined({ message: 'At least one of USER or SHOP must be provided' })
  @Column({ type: 'varchar' })
  role!: RoleType;
}
