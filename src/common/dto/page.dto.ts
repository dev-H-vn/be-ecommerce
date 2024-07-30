import { ApiProperty } from '@nestjs/swagger';

import { ClassField, NumberField } from '../../decorators';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @NumberField()
  readonly count: number;

  constructor(data: T[], count: number) {
    this.data = data;
    this.count = count;
  }
}
