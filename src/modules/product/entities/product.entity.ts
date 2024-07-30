import { IsNumber, Max, Min } from 'class-validator';
import { AbstractEntity } from 'common/abstract.entity';
import { ClothesEntity } from 'modules/product/entities/clothing.entity';
import { ElectronicEntity } from 'modules/product/entities/electronic.entity';
import slugify from 'slugify';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  productOwner!: Uuid;

  @Column({ type: 'varchar' })
  productName!: string;

  @Column({ type: 'varchar' })
  productThumb!: string;

  @Column({ type: 'varchar', default: '' })
  productSlug!: string;

  @BeforeInsert()
  @BeforeUpdate()
  validateData() {
    console.log('validateData called========='); // Debugging statement
    if (this.productName)
      this.productSlug = slugify(this.productName, { lower: true });
  }

  @Column({ type: 'numeric', default: 1 })
  @IsNumber()
  @Min(1, { message: 'Rating must be above 1.0' })
  @Max(5, { message: 'Rating must be un less than 5.0' })
  productAverage!: number;

  @Column('json', { default: [] })
  productVariations!: any[];

  @Column('boolean', { default: true })
  isDraft!: Boolean;

  @Column('boolean', { default: false })
  isPublish!: Boolean;

  @Column({ type: 'varchar' })
  productDescription!: string;

  @Column({ type: 'varchar' })
  productPrice!: number;

  @Column({ type: 'varchar' })
  productQuantity!: number;

  @Column({ type: 'varchar' })
  productType!: string;

  @Column('json')
  productAttributes!: Record<string, any>;
}
