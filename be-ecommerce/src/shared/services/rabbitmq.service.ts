import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RmqOptions, Transport } from '@nestjs/microservices';
import { Channel, connect } from 'amqplib';
import { lastValueFrom } from 'rxjs';
import { ApiConfigService } from 'shared/services/api-config.service';

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

  async assertExchange() {
    const notificationExchange = 'notificationExchange';
    const notifyQueue = 'notifyQueueProcess';
    const notificationExDLX = 'notificationExDLX';
    const notificationExKeyDLX = 'notificationExKeyDLX';

    // Create exchange
    await this.channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    // // Check if the queue exists and delete it if it does
    // try {
    //   await this.channel.checkQueue(notifyQueue);
    //   await this.channel.deleteQueue(notifyQueue);
    // } catch (error) {
    //   // Queue does not exist, no need to delete
    // }

    // Create queue with the desired arguments
    const queueResult = await this.channel.assertQueue(notifyQueue, {
      durable: true,
      deadLetterExchange: notificationExDLX,
      deadLetterRoutingKey: notificationExKeyDLX,
    });

    // Bind queue to exchange
    await this.channel.bindQueue(
      queueResult.queue,
      notificationExchange,
      'pattern',
    );

    const msg = 'new product';
    await this.channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: 10000,
    });
  }

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
