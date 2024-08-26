import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  RmqContext,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiConfigService } from 'shared/services/api-config.service';

@Injectable()
export class RmqService {
  constructor(
    @Inject('RABBIT_MQ') private readonly client: ClientProxy,
    private readonly configService: ApiConfigService,
  ) {}

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

  async sendMessage(pattern: string, data: any) {
    return lastValueFrom(this.client.send(pattern, data));
  }

  async emitMessage(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }
}
