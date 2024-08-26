import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RabbitController } from './rabbit.controller';

@Module({
  controllers: [RabbitController],
  providers: [RabbitService],
})
export class RabbitModule {}
