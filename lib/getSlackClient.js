'use strict';

const Promise = require('bluebird');
const request = require('request');

const SLACK_ENDPOINT = 'https://hooks.slack.com/services/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';


class SlackClient {

  constructor(logger) {
    this._logger = logger;
    this.urls = [];
  }

  publish(data) {

    if (!data.length) {
      return data;
    }

    const urls = 
      data
        .slice()
        .reverse()
        .map((item) => `https://twitter.com/realDonaldTrump/status/${item.id_str}`);

    return new Promise(((resolve, reject) => {

      request.post(
        {
          url: SLACK_ENDPOINT,
          body: JSON.stringify({
            channel: '#firstboat',
            username: 'twitter',
            text: urls.join(' '),
            icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
            //icon_emoji: ''
          })
        },
        ((err, response, body) => {
          
          if (err) {
            reject(err);
          } else {
            this._logger.info(`Published tweet urls to Slack: ${urls.join(',')}`);
            this.urls.push(...urls);
            resolve(this.urls);
          }

        }).bind(this)

      );

    }).bind(this));

  }

}

module.exports = function getSlackClient(logger) {
  return new SlackClient(logger);
};
