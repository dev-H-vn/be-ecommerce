require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const configs = require('./configs');

let server;
server = app.listen(configs.port, () => {
  console.log(`Listening to port ${configs.port}`);
});
// mongoose.connect('', {}).then(() => {
//   logger.info('Connected to MongoDB');
// });

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };

// const unexpectedErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received');
//   if (server) {
//     server.close();
//   }
// });
