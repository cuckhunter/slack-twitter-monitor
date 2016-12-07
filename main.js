/* jshint camelcase: false */

'use strict';

require('dotenv').config();
const lib = require('./lib');
const Promise = require('bluebird');

const TWITTER_SCREEN_NAME = 
'realDonaldTrump'
//'notiven'
;

function main() {

  const logger = lib.getLogger();
  const twitterClient = lib.getTwitterClient(logger);
  const slackClient = lib.getSlackClient(logger);
  const server = lib.getServer(logger, slackClient);

  Promise.try(() => {

    return twitterClient.getUserTimeline({
      screen_name: TWITTER_SCREEN_NAME,
      count: 2
    });

  }).then((data) => {

    return poll(
      data[process.env.MODE == 'prod' ? 0 : 1].id_str,
      logger,
      slackClient,
      twitterClient);

  }).catch((err) => {

    logger.error(err, Array.from(arguments).slice(1));

  });

  // Start server
  server.start();

}

function poll(sinceId, logger, slackClient, twitterClient) {

  const POLL_INTERVAL = (process.env.mode == 'prod') ? 30 * 1000 : 10 * 1000;

  return new Promise((resolve, reject) => {

    setTimeout(resolve, POLL_INTERVAL);

  }).then(() => {

    return twitterClient.getUserTimeline({
      screen_name: TWITTER_SCREEN_NAME,
      since_id: sinceId
    });

  }).then((data) => {

    if (data.length) {
      sinceId = data[0].id_str;
      return slackClient.publish(data);
    }

  }).then(() => {
    
    return poll(sinceId, logger, slackClient, twitterClient);

  });

}

main();
