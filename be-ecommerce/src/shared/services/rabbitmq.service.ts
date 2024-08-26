import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  RmqContext,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiConfigService } from 'shared/services/api-config.service';
import { Channel, connect } from 'amqplib';

@Injectable()
export class RmqService implements OnModuleInit {
  private channel!: Channel;

  constructor(
    @Inject('RABBIT_MQ') private readonly client: ClientProxy,
    private readonly configService: ApiConfigService,
  ) {}

  async onModuleInit() {
    const connection = await connect(
      this.configService.getString('RABBIT_MQ_URI'),
    );
    this.channel = await connection.createChannel();
  }

  async sendMessage(pattern: string, data: any) {
    return lastValueFrom(this.client.send(pattern, data));
  }

  // async assertExchange(pattern: string, data: any) {
  //   await this.channel.

  // }

  async emitMessage(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }

  getOptions(noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.getString('RABBIT_MQ_URI')],
        queue: this.configService.getString(`RABBIT_MQ_NAME_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }
}
