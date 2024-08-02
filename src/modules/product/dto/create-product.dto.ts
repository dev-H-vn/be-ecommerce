import { Type } from 'class-transformer';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { Category } from 'constant';
import {
  BooleanField,
  EnumFieldOptional,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from 'decorators';

export class Attributes {
  @NumberFieldOptional()
  size!: string;

  @StringFieldOptional()
  material!: string;
}

export class CreateProductDto {
  @StringField()
  productName!: string;

  @StringField()
  productThumb!: string;

  @NumberField({ min: 1, max: 5, default: 1 })
  productAverage!: number;

  @IsArray()
  productVariations!: any[]; // You might want to use a more specific type instead of `any`

  @BooleanField()
  isDraft!: boolean;

  @BooleanField()
  isPublish!: boolean;

  @StringField()
  productDescription!: string;

  @NumberField()
  productPrice!: number;

  @NumberField()
  productQuantity!: number;

  @StringFieldOptional()
  @EnumFieldOptional(() => Category)
  productType!: Category;

  @IsObject()
  @ValidateNested()
  @Type(() => Attributes)
  productAttributes!: Attributes;
}
