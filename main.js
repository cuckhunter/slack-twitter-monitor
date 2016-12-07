/* jshint camelcase: false */

'use strict';

const lib = require('./lib');
const Promise = require('bluebird');

function main() {

  const logger = lib.getLogger();
  const twitterClient = lib.getTwitterClient(logger);
  const slackClient = lib.getSlackClient(logger);
  const server = lib.getServer(logger, slackClient);

  Promise.try(() => {

    return twitterClient.getUserTimeline({
      screen_name: 'realDonaldTrump',
      count: 2
    });

  }).then((data) => {

    return poll(
      data[process.env.PORT ? 0 : 1].id_str,
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

  const POLL_INTERVAL = process.env.PORT ? 30 * 1000 : 10 * 1000;

  return Promise.try(() => {

    return new Promise((resolve, reject) => {
      setTimeout(resolve, POLL_INTERVAL);
    });

  }).then(() => {

    return twitterClient.getUserTimeline({
      screen_name: 'realDonaldTrump',
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
