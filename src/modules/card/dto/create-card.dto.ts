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

class ProductAddToCard {
  @UUIDField()
  productId!: Uuid;
  @UUIDField()
  shopId!: Uuid;
  @NumberField()
  quantity!: number;
}

export class CreateCardDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ProductAddToCard)
  product!: ProductAddToCard;
}
