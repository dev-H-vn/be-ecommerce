import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
} from 'decorators';

export class Attributes {
  @NumberFieldOptional()
  size!: string;

  @StringFieldOptional()
  material!: string;
}

export class UpdateProductDto {
  @UUIDField()
  id!: Uuid;

  @StringFieldOptional()
  productName!: string;

  @StringFieldOptional()
  productThumb!: string;

  @NumberFieldOptional({ min: 1, max: 5, default: 1 })
  productAverage!: number;

  @IsArray()
  @IsOptional()
  productVariations!: any[]; // You might want to use a more specific type instead of `any`

  @BooleanFieldOptional()
  isDraft!: boolean;

  @BooleanFieldOptional()
  isPublish!: boolean;

  @StringFieldOptional()
  productDescription!: string;

  @NumberFieldOptional()
  productPrice!: number;

  @NumberFieldOptional()
  productQuantity!: number;

  @StringFieldOptional()
  productType!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Attributes)
  productAttributes!: Attributes;
}
