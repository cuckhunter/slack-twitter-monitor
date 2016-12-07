'use strict';

const Promise = require('bluebird');
const Twitter = require('twitter-node-client').Twitter;

const TWITTER_API_CONFIG = {
  consumerKey: 'yd7ha7ycBmRDfTk9YclkrGlBS',
  consumerSecret: 'Cb032Xda44aM3HzCBRt3z9GwiYmpvp2VuSoI4UQNnr6r58JTbN',
  accessToken: '21429174-p3Oo40457k52Rl3fBgvinDNUAx7cyAibLRyNF5FQ5',
  accessTokenSecret: 'y09OTks43F9ej01vTDAGkjnLk1Z16asRRMFP4vF94j3t9',
  callBackUrl: 'http://www.google.com'
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
                return {
                  id: item.id_str,
                  user: item.user.name,
                  text: item.text
                };
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
