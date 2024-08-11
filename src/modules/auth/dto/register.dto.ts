import { RoleType } from 'constant';
import {
  EmailField,
  EmailFieldOptional,
  EnumField,
  PasswordField,
  StringField,
} from '../../../decorators';

export class UserRegisterDto {
  @StringField()
  readonly userName!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;
}

export class RegisterDto {
  @StringField({ nullable: false })
  userName!: string;

  @PasswordField({ minLength: 6 })
  password!: string;

  @EmailFieldOptional({ nullable: false })
  email!: string;

  @EnumField(() => RoleType, { default: RoleType.USER })
  role!: RoleType;
}
