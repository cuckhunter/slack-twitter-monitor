'use strict';

const inject = require('./inject');
const Twitter = require('twitter-node-client').Twitter;

function getTwitterService([$env, $logger]) {

  const twitter = new Twitter({
    consumerKey: $env.TWITTER_API_CONSUMER_KEY,
    consumerSecret: $env.TWITTER_API_CONSUMER_SECRET,
    // accessToken: $env.TWITTER_API_ACCESS_TOKEN,
    // accessTokenSecret: $env.TWITTER_API_ACCESS_TOKEN_SECRET
    accessToken: '807360232955449344-edkkNqfix9sl4AHFYImJrKk8DvCfC4h',
    accessTokenSecret: 'd9KTZNDP2tP00hNw5ek2Kww2TKntpPEkS7O3qZW3yA0Z5'
  });

  for (let method of ['getUserTimeline', 'getHomeTimeline']) {

    twitter[method] = function(params) {

      return new Promise((resolve, reject) => {

        Twitter.prototype[method].call(
          this,
          params,
          function error(error, request, body) {
            reject(error, request, body);
          },
          function success(data) {
            data = JSON.parse(data);
            if (data.length) {
              $logger.info('Twitter client found new tweets:', data.map((item) => {
                /* jshint camelcase: false */
                return JSON.stringify({
                  id: item.id_str,
                  user: item.user.name,
                  text: item.text
                }, null, 2);
              }));
            }
            resolve(data);
          }
        );
      });

    };

  }

  return twitter;

};

module.exports = inject(getTwitterService);
