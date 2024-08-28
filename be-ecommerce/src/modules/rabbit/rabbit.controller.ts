import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateRabbitDto } from './dto/create-rabbit.dto';
import { RabbitService } from './rabbit.service';

@Controller('rabbit')
@ApiBearerAuth()
@ApiTags('rabbit')
export class RabbitController {
  constructor(private readonly rabbitService: RabbitService) {}

  @Post()
  testRabbit(@Body() createRabbitDto: CreateRabbitDto) {
    return this.rabbitService.testRabbit(createRabbitDto);
  }

  @Post('assertExchange')
  testAssertExchange(@Body() createRabbitDto: CreateRabbitDto) {
    return this.rabbitService.assertExchange(createRabbitDto);
  }
}
