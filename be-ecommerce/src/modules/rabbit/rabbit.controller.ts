import { Controller, Post, Body } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { CreateRabbitDto } from './dto/create-rabbit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('rabbit')
@ApiBearerAuth()
@ApiTags('rabbit')
export class RabbitController {
  constructor(private readonly rabbitService: RabbitService) {}

  @Post()
  testRabbit(@Body() createRabbitDto: CreateRabbitDto) {
    return this.rabbitService.testRabbit(createRabbitDto);
  }
}
