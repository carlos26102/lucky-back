const logger = require('winston');

const loggerLoader = require('./loggerLoader');
const expressLoader = require('./expressLoader');

const loaders = async function(app) {
  loggerLoader(app);
  logger.info('Logger initializated!');

  expressLoader(app);
  logger.info('Express initializated!');
};

module.exports = loaders;
