import { IsArray, IsOptional } from 'class-validator';
import { DiscountAppliesTo, DiscountType } from 'constant';
import {
  BooleanField,
  DateField,
  EnumField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
  UUIDFieldOptional,
} from 'decorators';

export class CreateDiscountDto {
  @StringField()
  discountName!: string;

  @StringFieldOptional({ default: '', nullable: true })
  discountDes!: string;

  @EnumField(() => DiscountType)
  discountType!: DiscountType;

  @StringField()
  discountCode!: string;

  @DateField()
  discountStartDate!: Date;

  @DateField()
  discountEndDate!: Date;

  @NumberField()
  discountValue!: number;

  @NumberField({ default: 10 })
  discountMaxUses!: number;

  @NumberField({ default: 0 })
  discountUsedCount!: number;

  @IsArray()
  discountUsersUsed!: Array<Record<string, any>>;

  @NumberFieldOptional()
  discountMinOder!: number;

  @BooleanField({ default: false })
  discountActive!: boolean;

  @EnumField(() => DiscountAppliesTo)
  discountAppliesTo!: DiscountAppliesTo;

  @UUIDField({ nullable: true })
  discountShopId!: Uuid;

  @IsArray()
  @UUIDFieldOptional({ each: true })
  @IsOptional()
  discountAppliesToIds: Uuid[] = []; //applies to products
}
