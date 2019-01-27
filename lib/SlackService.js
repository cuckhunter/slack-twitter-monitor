'use strict';

const inject = require('./inject');
const request = require('request');

class SlackService {

  /**
   * Publish to Slack
   * 
   * @param  {Array<Tweet>} data
   * @return {Array<String>}  Published urls
   */
  publish([$env, $logger], data) {

    if (!data.length) {
      return [];
    }

    const SLACK_CHANNEL = ($env.MODE == 'prod') ? '#lifeboat' : '#slack-twitter-monitor';

    /* jshint camelcase: false */
    const urls = 
      data
        .slice()
        .reverse()
        .map((item) => `https://twitter.com/${item.user.screen_name}/status/${item.id_str}`);

    return new Promise((resolve, reject) => {

      /* jshint camelcase: false */
      const params = {
        url: $env.SLACK_API_ENDPOINT,
        body: JSON.stringify({
          channel: SLACK_CHANNEL,
          username: 'twitter',
          text: urls.join(' '),
          icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png',
          //icon_emoji: '',
        })
      };

      request.post(params, (err, response, body) => {
          
        if (err) {
          reject(new Error(JSON.stringify({err, response, body})));
        } else {
          $logger.info(`Published ${urls.length} tweet(s) to Slack channel ${SLACK_CHANNEL}: ${urls.join(',')}`);
          resolve();
        }

      });

    });

  }

  message([$env, $logger], {username, text, type, ts, attachments}) {

    const SLACK_CHANNEL = ($env.MODE == 'prod') ? '#lifeboat' : '#slack-twitter-monitor';

    return new Promise((resolve, reject) => {

      /* jshint camelcase: false */
      const params = {
        url: $env.SLACK_API_ENDPOINT,
        body: JSON.stringify({
          channel: SLACK_CHANNEL,
          username,
          text,
          type,
          ts,
          mrkdwn: true,
          //icon_url: icon, 
          //icon_emoji: '',
          attachments,
        })
      };

      request.post(params, (err, response, body) => {

        if (err) {
          reject(new Error(JSON.stringify({err, response, body})));
        } else {
          $logger.info(`Posted message to Slack channel ${SLACK_CHANNEL}: ${text}`);
          resolve();
        }

      });

    });

  }

  crashReport([$env, $logger], message) {

    const SLACK_CHANNEL = /*($env.MODE == 'prod') ? '#lifeboat' :*/ '#slack-twitter-monitor';

    return new Promise((resolve, reject) => {

      /* jshint camelcase: false */
      const params = {
        url: $env.SLACK_API_ENDPOINT,
        body: JSON.stringify({
          channel: SLACK_CHANNEL,
          username: 'twitter',
          text: `<@U24PPP3BK> 🌎 Twitter bot is kill 🌎\n\n\`\`\`${message}\`\`\``,
          icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
          //icon_emoji: ''
        })
      };

      request.post(params, (err, response, body) => {
          
        if (err) {
          reject(new Error(JSON.stringify({err, response, body})));
        } else {
          $logger.info(`Reported error to Slack channel ${SLACK_CHANNEL}`);
          resolve();
        }

      });

    });

  }

}

module.exports = function getSlackService() {
  return new SlackService();
};

inject(SlackService);
