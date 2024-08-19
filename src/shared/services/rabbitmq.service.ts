import { Injectable } from '@nestjs/common';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { ApiConfigService } from 'shared/services/api-config.service';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ApiConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        // urls: [this.configService.getString('RABBIT_MQ_URI')],
        // queue: this.configService.getString(`RABBIT_MQ_QUEUE_NAME`),
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
