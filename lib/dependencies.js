'use strict';

/** For now must be defined in topological order */
module.exports = {
  env: () => {
    require('dotenv').config();
    return process.env;
  },
  logger: () => {
    return require('./Logger')();
  },
  twitterService: () => {
    return require('./TwitterService')();
  },
  slackService: () => {
    return require('./SlackService')();
  },
  taskService: () => {
    return require('./TaskService')();
  },
  server: () => {
    return require('./Server')();
  }
};
