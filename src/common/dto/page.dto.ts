import { ApiProperty } from '@nestjs/swagger';

import { NumberField } from '../../decorators';

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
