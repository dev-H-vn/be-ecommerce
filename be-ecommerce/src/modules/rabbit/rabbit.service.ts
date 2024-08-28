import { Injectable } from '@nestjs/common';
import { CreateRabbitDto } from './dto/create-rabbit.dto';
import { UpdateRabbitDto } from './dto/update-rabbit.dto';
import { RmqService } from 'shared/services/rabbitmq.service';

@Injectable()
export class RabbitService {
  constructor(private rmqService: RmqService) {}

  async testRabbit(createRabbitDto: CreateRabbitDto) {
    const log = await this.rmqService.getOptions();
    const test = await this.rmqService.emitMessage('aaaa', { hi: 'hello' });

    console.log('🐉 ~ RabbitService ~ testRabbit ~ log ~  🚀\n', log, test);

    return 'This action adds a new rabbit';
  }

  async assertExchange(createRabbitDto: CreateRabbitDto) {
    const log = await this.rmqService.getOptions();
    const test = await this.rmqService.assertExchange();

    console.log('🐉 ~ RabbitService ~ testRabbit ~ log ~  🚀\n', log, test);

    return 'This action adds a new rabbit';
  }
}
