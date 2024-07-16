import {
  EmailField,
  EmailFieldOptional,
  PasswordField,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly userName!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;
}

export class ShopRegisterDto {
  @StringField()
  readonly shopName!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;
}
