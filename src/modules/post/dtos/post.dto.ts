import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DynamicTranslate, StaticTranslate } from '../../../decorators';
import type { PostEntity } from '../post.entity';

export class PostDto extends AbstractDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  constructor(postEntity: PostEntity) {
    super(postEntity);

    this.info = 'keywords.admin';
  }
}
