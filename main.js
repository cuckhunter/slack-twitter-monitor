'use strict';

function main() {

  const inject = require('./lib/inject');
  const app = require('./lib/app');
  inject.ready();
  app();

}

let active = false;

process.on('uncaughtException', async function(error) {

  try {

    if (active) {
      console.error('Error-handling error:', error);
      process.exit(1);
    }

    active = true;
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

    await new Promise((resolve, reject) => {

      request.post(params, (err, response, body) => {
        if (err) {
          reject(new Error(JSON.stringify({err, response, body})));
        } else {
          resolve(response, body);
        }
      });

    });

  } catch (e) {
    console.log('Error-handling error:', e);
  } finally {
    process.exit(1);
  }

});

main();
