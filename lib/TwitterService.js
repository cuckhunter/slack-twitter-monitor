'use strict';

const inject = require('./inject');
const Twitter = require('twitter-node-client').Twitter;

function getTwitterService([$env, $logger]) {

  const api = {};

  const apps = JSON.parse($env.TWITTER_APPS).map(({key,secret}) => {
    return new Twitter({
      consumerKey: key,
      consumerSecret: secret,
    });
  });

  console.log('apps', apps);

  let index = 0;

  for (const method of ['getUserTimeline', 'getHomeTimeline', 'getTweet']) {

    api[method] = function(params) {

      const twitter = apps[index++];
      params.tweet_mode = 'extended';

      return new Promise((resolve, reject) => {

        twitter[method](
          params,
          function error(err, request, body) {
            err.data = JSON.parse(err.data);
            err.params = params;
            reject(new Error(JSON.stringify(err, null, 2)));
          },
          function success(data) {
            data = JSON.parse(data);
            if (data.length) {
              $logger.info('Twitter client found new tweets:', data.map((item) => {
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

  return api;

};

module.exports = inject(getTwitterService);
