const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const { connectRabbitMQ, consumerToQueueFailed } = require('./dbs/init.rabbit');

const app = express();

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());
// jwt authentication
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connect to RabbitMQ
// Connect to RabbitMQ
(async function connectRabbit() {
  try {
    const rabbitMQ = await connectRabbitMQ();
    console.log('Connected to RabbitMQ successfully');
    const channel = rabbitMQ.channel;
    const { queue } = (global.channelRabbit = channel);
    global.queueNameRabbit = queue;

    const notifyQueue = 'notifyQueueProcess';
    channel.consume(notifyQueue, (msg) => {
      try {
        if (msg !== null) {
          // has error
          throw new Error('Failed to process message');

          console.log(`Received message: ${msg.content.toString()}`);
          channel.ack(msg);
        }
      } catch (error) {
        channel.nack(msg, false, false);
      }
    });

    // Start consuming failed messages
    await consumerToQueueFailed();
  } catch (err) {
    console.error('Failed to connect to RabbitMQ', err);
  }
})();

app.get('/send', (req, res) => {
  const { channelRabbit, queue } = global;

  if (channelRabbit) {
    channelRabbit.sendToQueue(queue, Buffer.from('aaaaaa'));
    res.send('Message sent to RabbitMQ');
  } else {
    connectRabbit();
  }
});

// v1 api routes
// app.use('/v1', routes);

// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });

module.exports = app;
