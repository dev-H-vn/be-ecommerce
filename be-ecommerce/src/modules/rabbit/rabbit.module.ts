import { Module } from '@nestjs/common';

import { RabbitController } from './rabbit.controller';
import { RabbitService } from './rabbit.service';

@Module({
  controllers: [RabbitController],
  providers: [RabbitService],
})
export class RabbitModule {}
