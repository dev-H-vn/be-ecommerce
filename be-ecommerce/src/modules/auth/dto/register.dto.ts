import { RoleType } from 'constant';

import {
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
  @EmailFieldOptional({ nullable: false })
  email!: string;

  @StringField({ nullable: false })
  userName!: string;

  @PasswordField({ minLength: 6 })
  password!: string;

  @EnumField(() => RoleType, { default: RoleType.USER })
  role!: RoleType;
}
