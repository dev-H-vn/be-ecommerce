const configs = {
  port: process.env.PORT,
  rabbitHost: process.env.RABBIT_MQ_URI,
  rabbitMqNameQueue: process.env.RABBIT_MQ_NAME_QUEUE,
};

module.exports = configs;
