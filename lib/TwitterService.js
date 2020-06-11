'use strict';

const inject = require('./inject');
const Twitter = require('twitter-node-client').Twitter;

function getTwitterService([$env, $logger]) {

  const apps = JSON.parse($env.TWITTER_APPS).map(({appKey,appSecret,userAccessToken,userAccessTokenSecret}) => {
    return new Twitter({
      consumerKey: appKey,
      consumerSecret: appSecret,
      accessToken: userAccessToken,
      accessTokenSecret: userAccessTokenSecret,
    });
  });

  const protectedApp = apps.find((app) => !!app.accessToken);

  const api = {};
  let index = 0;

  for (const method of ['getUser', 'getUserTimeline', 'getHomeTimeline', 'getTweet']) {

    api[method] = function(params) {

      let twitter = (params.protectedUser) ? protectedApp : apps[index++ % apps.length];
      if (twitter == protectedApp && params.screen_name == 'marcushjohnson') {
        twitter = apps[index++ % apps.length];
      }
      params.tweet_mode = 'extended';

      return new Promise((resolve, reject) => {

        twitter[method](
          params,
          function error(err, request, body) {
            console.log('twitter error', JSON.stringify(err, null, 2));
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
