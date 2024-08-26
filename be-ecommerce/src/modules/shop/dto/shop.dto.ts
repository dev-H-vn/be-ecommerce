import { AbstractDto } from '../../../common/dto/abstract.dto';
import { EmailField, StringField } from '../../../decorators';

// TODO, remove this class and use constructor's second argument's type
export type ShopDtoOptions = Partial<{ isActive: boolean }>;

export class ShopDto extends AbstractDto {
  @StringField()
  shopName!: string;

  //   @StringField()
  //   refreshToken!: string;

  @EmailField()
  email!: string | null;
}
