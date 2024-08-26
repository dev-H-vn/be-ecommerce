const amqp = require('amqplib');
const configs = require('../configs');

async function connectRabbitMQ() {
  try {
    console.log(
      '🐉 ~ connectRabbitMQ ~ configs.rabbitHost ~ 🚀\n',
      configs.rabbitHost,
    );
    const connection = await amqp.connect(configs.rabbitHost);
    console.log('Connected to RabbitMQ');

    const channel = await connection.createChannel();
    const queue = configs.rabbitMqNameQueue;

    await channel.assertQueue(queue, { durable: true });

    return { connection, channel, queue };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
}

module.exports = connectRabbitMQ;
