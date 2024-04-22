import { EmailField, StringField } from '../../../decorators';

export class UserLoginDto {
  @EmailField()
  readonly userName!: string;

  @StringField()
  readonly password!: string;
}
