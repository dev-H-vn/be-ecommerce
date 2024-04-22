import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @EmailField()
  readonly userName!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;
}
