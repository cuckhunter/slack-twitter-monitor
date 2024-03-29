'use strict';

let count = 0;

process.on('uncaughtException', async function(error) {

  const number = count++;

  try {

    console.error(`in uncaughtException ${number}:`, error);

    const request = require('request');
    const channel = 'logging';
    const params = {
      url: JSON.parse(process.env.SLACK_API_ENDPOINT)[channel],
      body: JSON.stringify({
        username: 'twitter',
        text: `<@U24PPP3BK> 🌎 Twitter bot is kill 🌎\n\n\`\`\`${error.stack}\`\`\``,
        icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
        //icon_emoji: ''
      })
    };

    await new Promise((resolve, reject) => {

      request.post(params, (err, response, body) => {
        if (err) {
          reject(new Error(JSON.stringify({err, response, body}, null, 2)));
        } else {
          resolve(response, body);
        }
      });

    });

    console.error(`Reported error to Slack channel ${channel}`);

    // await new Promise((resolve, reject) => {
    //   setTimeout(resolve, 3 * 60 * 1000);
    // });

  } catch (e) {
    console.error(`Error-handling error ${count}:`, e);
  } finally {
    process.exit(1);
  }

});

function main() {

  const inject = require('./lib/inject');
  const app = require('./lib/app');
  inject.ready();
  app();

}

main();
