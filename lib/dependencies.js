'use strict';

/** For now must be defined in topological order */
module.exports = {
  
  env: () =>
    require('./Env')(),
  
  logger: () =>
    require('./Logger')(),
  
  twitterService: () =>
    require('./TwitterService')(),
  
  slackService: () =>
    require('./SlackService')(),
  
  taskService: () =>
    require('./TaskService')(),
  
  server: () =>
    require('./Server')()

};
