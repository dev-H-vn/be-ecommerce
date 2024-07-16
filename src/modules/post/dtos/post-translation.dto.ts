import { LanguageCode } from '../../../constant';
import { EnumFieldOptional, StringFieldOptional } from '../../../decorators';
import type { PostTranslationEntity } from '../post-translation.entity';

export class PostTranslationDto {
  @StringFieldOptional()
  title?: string;

  @StringFieldOptional()
  description?: string;

  @EnumFieldOptional(() => LanguageCode)
  languageCode?: LanguageCode;

  constructor(postTranslationEntity: PostTranslationEntity) {
    this.title = postTranslationEntity.title;
    this.description = postTranslationEntity.description;
  }
}
