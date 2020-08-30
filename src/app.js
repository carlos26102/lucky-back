const express = require('express');
const logger = require('winston');
const path = require('path');
const app = express();


const config = require('./config/mainConfig');
const loaders = require('./loaders/mainLoader');
require('./helpers/db');

app.use(express.static(path.join(__dirname, '..', 'public')));


/** Punto de entrada
*/
function boostrapServer() {
  const server = app.listen(config.app.port);

  server.on('error', onError);
  server.on('listening', () => {
    loaders(app);
    logger.info('Server running on port ' + config.app.port);
  });
}

/** Manejador de error
 * @param {String} err
 */
function onError(err) {
  switch (err.code) {
    case 'EACCES':
      logger.error(config.app.port + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(config.app.port + ' is already in use');
      process.exit(1);
      break;
    default:
      logger.error(err);
  }
}

exports.boostrapServer = boostrapServer;
