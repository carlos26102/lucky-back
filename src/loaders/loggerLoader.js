const morgan = require('morgan');
const winston = require('winston');

const config = require('../config/mainConfig');
const winstonConfig = require('../config/winstonConfig');

const loggerLoader = function(app) {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File(winstonConfig.file),
      new winston.transports.Console(winstonConfig.console),
    ],
    exitOnError: false,
  });

  winston.add(logger);

  app.use(morgan(config.app.morgan));
};

module.exports = loggerLoader;
