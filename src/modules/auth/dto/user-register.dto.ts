import { PasswordField, StringField } from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly userName!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;
}
