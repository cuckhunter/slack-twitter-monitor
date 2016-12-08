/* jshint camelcase: false */

'use strict';

require('dotenv').config();
const lib = require('./lib');

const TWITTER_SCREEN_NAME = 
'realDonaldTrump'
//'notiven'
;

async function main() {

  const logger = lib.getLogger();
  const twitterClient = lib.getTwitterClient(logger);
  const slackClient = lib.getSlackClient(logger);
  const server = lib.getServer(logger, slackClient);

  // Start server
  server.start();

  try {
 
    const data = await twitterClient.getUserTimeline({
      screen_name: TWITTER_SCREEN_NAME,
      include_rts: true,
      count: 2
    });
    
    await poll(
      data[process.env.MODE == 'prod' ? 0 : 1].id_str,
      logger,
      slackClient,
      twitterClient);

  } catch (e) {

    logger.error(err, Array.from(arguments).slice(1));

  }

}

async function poll(sinceId, logger, slackClient, twitterClient) {

  const POLL_INTERVAL = (process.env.mode == 'prod') ? 30 * 1000 : 10 * 1000;

  await new Promise((resolve, reject) => {
    setTimeout(resolve, POLL_INTERVAL);
  });

  const data = await twitterClient.getUserTimeline({
    screen_name: TWITTER_SCREEN_NAME,
    include_rts: true,
    since_id: sinceId
  });

  if (data.length) {
    sinceId = data[0].id_str;
    slackClient.publish(data);
  }
    
  return poll(sinceId, logger, slackClient, twitterClient);

}

main();
