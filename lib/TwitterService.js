'use strict';

const inject = require('./inject');
const Twitter = require('twitter-node-client').Twitter;
const axios = require('axios');

function getTwitterService([$env, $logger]) {

  const apps = JSON.parse($env.TWITTER_APPS).map(({appKey,appSecret,userAccessToken,userAccessTokenSecret}) => {
    return new Twitter({
      consumerKey: appKey,
      consumerSecret: appSecret,
      accessToken: userAccessToken,
      accessTokenSecret: userAccessTokenSecret,
    });
  });

  const protectedAppIndex = apps.findIndex((app) => !!app.accessToken);
  const protectedApp = apps[protectedAppIndex];

  const api = {};
  let index = 0;

  api.getMentions = async function(userName, { sinceId }) {

    const url = `https://api.twitter.com/2/tweets/search/recent`;

    const params = {
      query: `to:${screenName}`,
      'expansions': 'author_id',
      'tweet.fields': 'created_at',
      'user.fields': 'username',
    };

    if (since_id) {
      params.since_id = sinceId;
    }
    
    try {

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${env.BEARER_TOKEN}`,
        },
        params,
      });

      $logger.info('Twitter client found new tweets:', JSON.stringify(response.data, null, 2));
      return response.data;

    } catch (err) {

      console.log('twitter error', JSON.stringify(err, null, 2));
      throw new Error(JSON.stringify(err, null, 2));

    }

  }

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
