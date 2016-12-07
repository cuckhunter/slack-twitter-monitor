'use strict';

const Promise = require('bluebird');
const Twitter = require('twitter-node-client').Twitter;

const TWITTER_API_CONFIG = {
  consumerKey: process.env.TWITTER_API_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_API_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_API_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_API_ACCESS_TOKEN_SECRET
};

module.exports = function getTwitterClient(logger) {

  const twitter = new Twitter(TWITTER_API_CONFIG);

  twitter.getUserTimeline = ((fn) => {

    return function getUserTimeline(params) {

      return new Promise((resolve, reject) => {
        fn(
          params,
          function error(error, request, body) {
            reject(error, request, body);
          },
          function success(data) {
            data = JSON.parse(data);
            if (data.length) {
              logger.info('Twitter client found new tweets:', data.map((item) => {
                /* jshint camelcase: false */
                return JSON.stringify({
                  id: item.id_str,
                  user: item.user.name,
                  text: item.text
                }, null, 2);
              }));
            } else {
              logger.info('Twitter client found no new tweets');
            }
            resolve(data);
          }
        );
      });

    };

  })(twitter.getUserTimeline.bind(twitter));

  return twitter;

};
