import { Type } from 'class-transformer';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { NumberField, StringFieldOptional, UUIDField } from 'decorators';

export class CreateOrderDto {}

class Discount {
  @UUIDField()
  discountId!: Uuid;

  @StringFieldOptional()
  code!: string;
}

class ItemProduct {
  @UUIDField()
  productId!: Uuid;
  @NumberField({ default: 1 })
  quantity!: number;
}

// Use the types in the Orders class
class Orders {
  @UUIDField()
  shopId!: Uuid;

  @IsObject({ each: true })
  @Type(() => Discount)
  shopDiscounts!: Discount[];

  @IsObject({ each: true })
  @Type(() => Discount)
  discounts!: Discount[];

  @IsObject({ each: true })
  @Type(() => ItemProduct)
  itemsProduct!: ItemProduct[];
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested()
  @Type(() => Orders)
  orders!: Orders[];
}
