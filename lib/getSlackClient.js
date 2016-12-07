'use strict';

const Promise = require('bluebird');
const request = require('request');

const SLACK_CHANNEL = (process.env.MODE == 'prod') ? '#lifeboat' : '#firstboat';


class SlackClient {

  constructor(logger) {
    this._logger = logger;
    this.urls = [];
  }

  /**
   * Publish to Slack
   * 
   * @param  {Array<Tweet>} data
   * @return {Array<String>}  Published urls
   */
  publish(data) {

    if (!data.length) {
      return [];
    }

    /* jshint camelcase: false */
    const urls = 
      data
        .slice()
        .reverse()
        .map((item) => `https://twitter.com/${item.user.name}/status/${item.id_str}`);

    return new Promise(((resolve, reject) => {

      /* jshint camelcase: false */
      const params = {
        url: process.env.SLACK_API_ENDPOINT,
        body: JSON.stringify({
          channel: SLACK_CHANNEL,
          username: 'twitter',
          text: urls.join(' '),
          icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
          //icon_emoji: ''
        })
      };

      request.post(params, ((err, response, body) => {
          
        if (err) {
          reject(err);
        } else {
          this._logger.info(`Published ${urls.length} tweet(s) to Slack channel ${SLACK_CHANNEL}: ${urls.join(',')}`);
          this.urls.push(...urls);
          resolve(this.urls);
        }

      }).bind(this));

    }).bind(this));

  }

}

module.exports = function getSlackClient(logger) {
  return new SlackClient(logger);
};
