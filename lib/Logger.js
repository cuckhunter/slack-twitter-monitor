'use strict';

const winston = require('winston');
const LOG_PATH = 'tmp/app.log';

module.exports = function getLogger() {

  return winston.createLogger({
    transports: [
      new (winston.transports.Console)({ level: 'info' }),
      new (winston.transports.File)({ filename: LOG_PATH, level: 'warn' })
    ]
  });
};
