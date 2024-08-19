import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { NumberField, UUIDField } from 'decorators';

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
