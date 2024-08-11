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
  UUIDField,
} from 'decorators';

class ProductAddToCart {
  @UUIDField()
  productId!: Uuid;
  @NumberField()
  quantity!: number;
}

export class CreateCartDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ProductAddToCart)
  product!: ProductAddToCart;
}
