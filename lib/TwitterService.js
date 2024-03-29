'use strict';

const inject = require('./inject');
const Twitter = require('twitter-node-client').Twitter;
const axios = require('axios');
require('axios-debug-log/enable');

function getTwitterService([$env, $logger]) {

  const apps = JSON.parse($env.TWITTER_APPS).map(({appKey,appSecret,userAccessToken,userAccessTokenSecret}) => {
    
    const twitter = new Twitter({
      consumerKey: appKey,
      consumerSecret: appSecret,
      accessToken: userAccessToken,
      accessTokenSecret: userAccessTokenSecret,
    });

    // twitter.baseUrl = 'https://tpop-api.twitter.com/1.1'; // replacing api.twitter.com with IP

    return twitter;

  });

  const protectedAppIndex = apps.findIndex((app) => !!app.accessToken);
  const protectedApp = apps[protectedAppIndex];

  let index = 0;

  const api = {

    async getMentions(screenName, { sinceId } = {}) {

      const url = `https://api.twitter.com/2/tweets/search/recent`;

      const params = {
        query: `@${screenName}`,
        'expansions': ['author_id', 'in_reply_to_user_id', 'referenced_tweets.id', 'referenced_tweets.id.author_id'].join(','),
        'tweet.fields': ['author_id', 'created_at', 'in_reply_to_user_id', 'referenced_tweets'].join(','),
        'user.fields': ['name', 'username'].join(','),
      };

      if (sinceId) {
        params.since_id = sinceId;
      }
      
      try {

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${$env.BEARER_TOKEN}`,
          },
          params,
        });

        $logger.info('Twitter client found new tweets:', JSON.stringify(response.data, null, 2));
        return response.data;

      } catch (err) {

        console.error('twitter error', err.stack);
        throw err;

      }

    }

  };

  for (const method of ['getUser', 'getUserTimeline', 'getSearch', 'getHomeTimeline', 'getTweet']) {

    api[method] = function(params) {

      let twitter = (params.protectedUser) ? protectedApp : apps[index++ % apps.length];

      // workaround for @marcushjohnson having blocked the user associated with protected app
      if (twitter == protectedApp && params.screen_name == 'marcushjohnson') {
        twitter = apps[(protectedAppIndex + 1) % apps.length];
      }
      params.tweet_mode = 'extended';

      return new Promise((resolve, reject) => {

        twitter[method](
          params,
          function error(err, request, body) {
            const errJson = JSON.stringify(err, null, 2);
            console.error('twitter error', err.stack, errJson);
            err._method = method;
            err._params = params;
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
