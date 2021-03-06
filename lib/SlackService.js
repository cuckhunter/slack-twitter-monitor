'use strict';

const inject = require('./inject');
const request = require('request');

class SlackService {

  /**
   * Publish to Slack
   * 
   * @param  {Array<Tweet>} data
   * @param  {String} (message)
   * @param  {String} (channel)
   * @return {Array<String>}  Published urls
   */
  publish([$env, $logger], data, message, channel) {

    if (!data.length) {
      return [];
    }

    const endpoints = JSON.parse($env.SLACK_API_ENDPOINT);
    channel || (channel = ($env.MODE == 'prod') ? 'primary' : 'logging');

    /* jshint camelcase: false */
    const urls = 
      data
        .slice()
        .reverse()
        .map((item) => `https://twitter.com/${item.user.screen_name}/status/${item.id_str}`);

    return new Promise((resolve, reject) => {

      /* jshint camelcase: false */
      const params = {
        url: endpoints[channel],
        body: JSON.stringify({
          username: 'twitter',
          text: urls.join(' ') + (message ? ` ${message}` : ''),
          mrkdwn: true,
          icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png',
          //icon_emoji: '',
        })
      };

      request.post(params, (err, response, body) => {
          
        if (err) {
          reject(new Error(JSON.stringify({err, response, body}, null, 2)));
        } else {
          $logger.info(`Published ${urls.length} tweet(s) to Slack channel ${channel}: ${urls.join(',')}`);
          resolve();
        }

      });

    });

  }

  message([$env, $logger], {channel, username, text, attachments} = {}) {

    const endpoints = JSON.parse($env.SLACK_API_ENDPOINT);
    channel || (channel = ($env.MODE == 'prod') ? 'primary' : 'logging');

    return new Promise((resolve, reject) => {

      /* jshint camelcase: false */
      const params = {
        url: endpoints[channel],
        body: JSON.stringify({
          username,
          text,
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
          $logger.info(`Posted message to Slack channel ${channel}: ${text}`);
          resolve();
        }

      });

    });

  }

  // crashReport([$env, $logger], message) {

  //   const SLACK_CHANNEL = /*($env.MODE == 'prod') ? '#lifeboat' :*/ '#slack-twitter-monitor';

  //   return new Promise((resolve, reject) => {

  //     /* jshint camelcase: false */
  //     const params = {
  //       url: $env.SLACK_API_ENDPOINT,
  //       body: JSON.stringify({
  //         channel: SLACK_CHANNEL,
  //         username: 'twitter',
  //         text: `<@U24PPP3BK> 🌎 Twitter bot is kill 🌎\n\n\`\`\`${message}\`\`\``,
  //         icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
  //         //icon_emoji: ''
  //       })
  //     };

  //     request.post(params, (err, response, body) => {
          
  //       if (err) {
  //         reject(new Error(JSON.stringify({err, response, body})));
  //       } else {
  //         $logger.info(`Reported error to Slack channel ${SLACK_CHANNEL}`);
  //         resolve();
  //       }

  //     });

  //   });

  // }

}

module.exports = function getSlackService() {
  return new SlackService();
};

inject(SlackService);
