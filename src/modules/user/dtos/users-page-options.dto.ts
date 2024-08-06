import { BooleanFieldOptional } from 'decorators';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class UsersPageOptionsDto extends PageOptionsDto {}

export class ProductPageOptionsDto extends PageOptionsDto {
  @BooleanFieldOptional({
    default: undefined,
  })
  readonly isPublished: boolean;

  @BooleanFieldOptional({
    default: undefined,
  })
  readonly isDrafted: boolean;

  constructor(isPublished: boolean, isDrafted: boolean) {
    super();
    this.isPublished = isPublished;
    this.isDrafted = isDrafted;
  }
}

export class DiscountPageOptionsDto extends PageOptionsDto {
  @BooleanFieldOptional({
    default: undefined,
  })
  readonly isActive: boolean;

  constructor(isActive: boolean, isDrafted: boolean) {
    super();
    this.isActive = isActive;
  }
}
