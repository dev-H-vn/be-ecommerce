import { StringField } from '../../../decorators';

export class UserLoginDto {
  @StringField({ required: true })
  readonly userName!: string;

  @StringField({ required: true, minLength: 6 })
  readonly password!: string;
}

export class ShopLoginDto {
  @StringField({ required: true })
  readonly shopName!: string;

  @StringField({ required: true, minLength: 6 })
  readonly password!: string;
}
