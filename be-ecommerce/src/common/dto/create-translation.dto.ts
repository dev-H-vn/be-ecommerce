import { LanguageCode } from '../../constant';
import { EnumField, StringField } from '../../decorators';

export class CreateTranslationDto {
  @EnumField(() => LanguageCode)
  languageCode!: LanguageCode;

  @StringField()
  text!: string;
}
