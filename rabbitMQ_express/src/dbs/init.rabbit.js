const amqp = require('amqplib');
const configs = require('../configs');

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(configs.rabbitHost);
    console.log('Connected to RabbitMQ');
    console.log(
      '🐉 ~ connectRabbitMQ ~ configs.rabbitHost ~ 🚀\n',
      configs.rabbitHost,
    );
    const channel = await connection.createChannel();
    const queue = configs.rabbitMqNameQueue;

    return { connection, channel, queue };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
}

function disconnectRabbitMQ(connection) {
  try {
    setTimeout(async () => {
      await connection.close();
      console.log('Disconnected from RabbitMQ');
    }, 500);
  } catch (error) {
    console.error('Failed to disconnect from RabbitMQ', error);
  }
}

async function consumerToQueueFailed() {
  try {
    console.log('Consumer listening for failed messages');
    const mq = await connectRabbitMQ();
    const channel = mq.channel;

    const notifyQueueHandler = 'notifyQueueHandler';
    const notificationExDLX = 'notificationExDLX';
    const notificationExKeyDLX = 'notificationExKeyDLX';

    // Assert the exchanges
    await channel.assertExchange(notificationExDLX, 'direct', {
      durable: true,
    });

    // Assert the queue and bind it to the exchange
    const queueResult = await channel.assertQueue(notifyQueueHandler, {
      exclusive: true,
    });

    await channel.bindQueue(
      queueResult.queue,
      notificationExDLX,
      notificationExKeyDLX,
    );

    // Consume messages from the queue
    channel.consume(
      queueResult.queue,
      (message) => {
        const content = message.content.toString();
        console.log('Received failed message:', content);
        // TODO: Handle the failed message
        // channel.ack(message);
      },
      { noAck: true },
    );
  } catch (error) {
    console.error('Failed to consume messages from queue', error);
  }
}

module.exports = {
  connectRabbitMQ,
  consumerToQueueFailed,
};
