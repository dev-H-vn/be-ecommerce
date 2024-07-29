import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import {
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

  @StringField()
  productDescription!: string;

  @NumberField()
  productPrice!: number;

  @NumberField()
  productQuantity!: number;

  @StringField()
  productType!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Attributes)
  productAttributes!: Attributes;
}
