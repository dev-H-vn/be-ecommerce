import { Validate, ValidationArguments } from 'class-validator';
import { RoleType } from 'constant';

import {
  EnumField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class UserLoginDto {
  @StringField({ required: true })
  readonly userName!: string;

  @StringField({ required: true, minLength: 6 })
  readonly password!: string;
}

class RequireAtLeastOneField {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    return value !== undefined || relatedValue !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;

    return `Either ${args.property} or ${relatedPropertyName} must be provided.`;
  }
}

export class LoginDto {
  @StringFieldOptional()
  @Validate(RequireAtLeastOneField, ['userName'])
  readonly email!: string;

  @StringFieldOptional()
  @Validate(RequireAtLeastOneField, ['email'])
  readonly userName!: string;

  @StringField({ required: true, minLength: 6 })
  readonly password!: string;

  @EnumField(() => RoleType, { default: RoleType.USER })
  role!: RoleType;
}
