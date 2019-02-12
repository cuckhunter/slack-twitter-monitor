'use strict';

async function main() {

  const request = require('request');

  try {

    const inject = require('./lib/inject');
    const app = require('./lib/app');
    inject.ready();
    await app();

  } catch (e) {

    const params = {
      url: process.env.SLACK_API_ENDPOINT,
      body: JSON.stringify({
        channel: '#slack-twitter-monitor',
        username: 'twitter',
        text: `<@U24PPP3BK> 🌎 Twitter bot is kill 🌎\n\n\`\`\`${message}\`\`\``,
        icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
        //icon_emoji: ''
      })
    };

    request.post(params, (err, response, body) => {

      if (err) {
        throw new Error(JSON.stringify({err, response, body}));
      } else {
        console.error('App error:', e);
        console.log(`Reported error to Slack channel ${SLACK_CHANNEL}`);
        process.exit(1);
      }

    });

  }

}

main();
