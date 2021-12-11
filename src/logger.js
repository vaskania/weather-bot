const pino = require('pino');

let logger = pino();

if (process.env.PRETTY_LOGGING) {
  logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: true,
      },
    },
  });
}

module.exports = logger;
