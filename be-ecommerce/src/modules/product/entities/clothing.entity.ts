import { AbstractEntity } from 'common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'clothes' })
export class ClothesEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  productOwner!: Uuid;

  @Column({ type: 'varchar' })
  size!: string;

  @Column({ type: 'varchar' })
  material!: string;
}
