'use strict';

function main() {

  const inject = require('./lib/inject');
  const app = require('./lib/app');
  inject.ready();
  app();

}

process.on('uncaughtException', function(error) {
  
  try {

    const request = require('request');
    const SLACK_CHANNEL = '#slack-twitter-monitor';
    const params = {
      url: process.env.SLACK_API_ENDPOINT,
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        username: 'twitter',
        text: `<@U24PPP3BK> 🌎 Twitter bot is kill 🌎\n\n\`\`\`${e.stack}\`\`\``,
        icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
        //icon_emoji: ''
      })
    };

    request.post(params, (err, response, body) => {

      try {
        if (err) {
          console.error('Error-handling error:', new Error(JSON.stringify({err, response, body})));
        } else {
          console.error('App error:', error);
          console.log(`Reported error to Slack channel ${SLACK_CHANNEL}`);
        }
      } catch (e) {
        console.error('Error-handling error:', e);
      } finally {
        process.exit(1);
      }

    });

  } catch (e) {
    console.log('Error-handling error:', e);
    process.exit(1);
  }

});

main();
