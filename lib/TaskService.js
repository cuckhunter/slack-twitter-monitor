/* jshint camelcase: false */

'use strict';

const request = require('request');
const inject = require('./inject');

const KEYWORDS_REG_EXP = new RegExp('(?<!@\\w*|://\\S*)(?:' + [
  '1488',
  // 'bernie',
  'black ?swan',
  'blue dog',
  'bug ?chaser',
  'bugman|bugmen',
  'burn in hell',
  'burn(?:ed)? at the stake',
  'chad',
  'chopping off heads',
  'cocaine mitch',
  // 'cookie',
  'cordovan',
  'cuck',
  'curry|curries',
  'dartmouth',
  'deadlift',
  'degenerat\\w*',
  'dog catcher',
  'etoro',
  'exploding offer',
  'evola',
  'fag',
  'goy',
  '\\bhag',
  'haram\\b',
  'hillary',
  '\\bhere\'s why',
  'heretic',
  'incel|volcel',
  'israel',
  '\\biq',
  'jelq\\w*',
  'jew',
  '#LearnToCode',
  'like a dog',
  'lugenpresse',
  'many are saying',
  'miscegenat\\w*',
  'neocon',
  'neoliberal',
  'nofap',
  'orgy of evidence',
  '\\bpagan',
  'pepe',
  // 'pizza',
  'power law',
  'rent.?seek\\w*|seeking.*\\brent',
  'rings true',
  'shekel',
  'shithole',
  'shut up and dribble',
  'snus',
  'sodom\\w*',
  'soetoro',
  'soy',
  'spengler',
  'steel ?man',
  'thot',
  'telegony',
  'transsexual|tranny|trannies',
  'watch the film',
  'wear(?:ing)? the horns',
  'zio(?:n\\w*)?',
].join('|') + ')', 'i');

console.log(KEYWORDS_REG_EXP);

const CAPS_REG_EXP = /^[^a-z]*$/;

function setPoll(fn, interval) {
  
  return async function poll() {
    
    await fn();

    await new Promise((resolve) => {
      setTimeout(resolve, interval);
    });

    return poll(fn, interval);

  };

}

const TWEET_FILTERS = [
  (tweet, text) => {
    for (const hashtag of tweet.entities.hashtags) {
      text = text.replace(new RegExp(hashtag.text, 'i'), '');
    }
    return text;
  },
  (tweet, text) => {
    for (const symbol of tweet.entities.symbols) {
      text = text.replace(new RegExp('$' + symbol.text, 'i'), '');
    }
    return text;
  },
  (tweet, text) => {
    for (const userMention of tweet.entities.user_mentions) {
      text = text.replace(new RegExp('@' + userMention.screen_name, 'i'), '');
    }
    return text;
  },
  (tweet, text) => {
    for (const url of tweet.entities.urls) {
      text = text.replace(new RegExp(url.url, 'i'), '');
    }
    return text;
  },
  (tweet, text) => {
    for (const media of (tweet.extended_entities ? tweet.extended_entities.media : [])) {
      text = text.replace(new RegExp(media.url, 'i'), '');
    }
    return text;
  },
];

function filterTweetText(tweet) {

  return TWEET_FILTERS.reduce((memo, filter) => filter(tweet, memo), tweet.full_text);

}

class TaskService {

  constructor() {
    this._tasks = {};
  }

  async runPredictItTask([$slackService], id) {

    const interval = 240 * 60 * 1000;

    let time;

    const execute = setPoll(async () => {

      const body = await new Promise((resolve, reject) => {

        request({
          url: `https://www.predictit.org/api/marketdata/markets/${id}`,
          timeout: 60000,
        }, (err, response, body) => {
          if (err) {
            reject(new Error(JSON.stringify({err, response, body})));
          } else {
            resolve(body);
          }
        });

      });

      const market = JSON.parse(body);
      let result = `*<${market.url}|${market.shortName}>*\n`;
      if (market.contracts.length == 1) {
        result += `Yes - ${market.contracts[0].lastTradePrice.toFixed(2)}\n`;
      } else {
        for (const contract of market.contracts) {
          result += `${contract.name} - ${contract.lastTradePrice.toFixed(2)}\n`;
        }
      }

      await $slackService.message({
        username: 'predictit',
        text: result,
      });

    }, interval);

    const status = () => {

      return {
        type: 'PredictIt',
        time,
      };

    }

    time = Date.now();
    await this._run(execute, status);

  }

  /**
   * All tweets from user
   * 
   * @param  {String} screenName
   * @param  {Boolean} (excludeReplies)
   * @param  {Number} (modulus)
   */
  async runAllTweetsTask(
    [$env, $slackService, $twitterService],
    screenName,
    excludeReplies = true,
    modulus = 1,
  ) {

    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2
    });

    const interval = ($env.MODE == 'prod') ? (90 * 1000) : (10 * 1000);
    const name = initialTweets[0].user.name;
    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweet;
    let time;
    
    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getUserTimeline({
        screen_name: screenName,
        include_rts: true,
        since_id: sinceId,
      });

      if (newTweets.length) {

        const tweets = [];

        for (let i = 0; i < newTweets.length; i++) {
          let tweet = newTweets[i];
          if (
            ((tweet.user.statuses_count - i) % modulus === 0) &&
            (!excludeReplies || tweet.in_reply_to_screen_name == null || tweet.in_reply_to_screen_name == screenName) &&
            (tweet.user.screen_name != 'RealSkipBayless' || !/undisputed/i.test(tweet.full_text)) &&
            (tweet.user.screen_name != 'NFL_Scorigami' || /This game has a [3-9]\d|That's Scorigami/.test(tweet.full_text))
          ) {
            tweets.push(tweet);
          }
        }

        if (tweets.length) {
          await $slackService.publish(tweets);
          lastTweet = tweets.slice().pop();
          time = Date.now();
          total += tweets.length;
        }

        sinceId = newTweets[0].id_str;

      }

    }, interval);
    
    const status = () => {

      return {
        type: 'AllTweets',
        screenName,
        name,
        total,
        lastTweet,
        time,
      };

    };

    await this._run(execute, status);
    
  }

  /**
   * Best tweets from user's home timeline
   */
  async runBestTweetsTask([$env, $slackService, $twitterService]) {

    const initialTweets = await $twitterService.getHomeTimeline({
      include_rts: true,
      count: 2
    });

    const interval = ($env.MODE == 'prod') ? (120 * 60 * 1000) : (60 * 1000);
    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweet;
    let time;

    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getHomeTimeline({
        include_rts: true,
        since_id: sinceId
      });

      if (newTweets.length) {

        await $slackService.publish([newTweets[0]]);
       
        sinceId = newTweets[0].id_str;
        lastTweet = newTweets[0];
        time = Date.now();
        total++;

      }

    }, interval);

    const status = () => {
      
      return {
        type: 'BestTweets',
        total,
        lastTweet,
        time,
      };

    }

    await this._run(execute, status);

  }

  /**
   * High scoring tweets from user
   * 
   * @param  {String} screenName
   */
  async runHighScoringTweetsTask([$env, $slackService, $twitterService], screenName, level) {

    const MAX_DELAY = 6 * 60 * 1000;
    const MIN_SCORE = 0.0012;
    
    const getScore = function ({
      favorite_count: favoriteCount,
      retweet_count: retweetCount,
      user: { followers_count: followersCount }
    }) {
      
      const rawScore = favoriteCount + 3 * retweetCount;

      const result =
        (level == 'high') ? ((rawScore * 6) / followersCount) :
        (level == 'low') ? (rawScore / (followersCount * 3)) :
        (followersCount > 10000) ? (rawScore / followersCount) :
        (followersCount > 0) ? (rawScore  / (followersCount * 3)) :
        0;

      return result;

    }
    
    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2
    });

    const interval = ($env.MODE == 'prod') ? (120 * 1000) : (60 * 1000);
    const name = initialTweets[0].user.name;
    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweet;
    let time;
    let published = {};
    
    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getUserTimeline({
        screen_name: screenName,
        include_rts: true,
        since_id: sinceId
      });

      if (newTweets.length) {

        const now = Date.now();
        const newPublished = {};

        for (let i = newTweets.length - 1; i >= 0; i--) {
          
          const tweet = newTweets[i];
          const retweet = tweet.retweeted_status;
          const quoted = tweet.quoted_status;
          const age = now - new Date(tweet.created_at);
          
          if (age < MAX_DELAY) {

            const score = getScore(retweet || tweet);
            const keywordsMatch = KEYWORDS_REG_EXP.exec(filterTweetText(tweet)) || (quoted && KEYWORDS_REG_EXP.exec(filterTweetText(quoted)));
            const capsMatch = CAPS_REG_EXP.exec(tweet.full_text);
            if (score >= MIN_SCORE || keywordsMatch || capsMatch) {
              if (!published[tweet.id_str] && !retweet) {
                await $slackService.publish(
                  [tweet],
                  keywordsMatch ? `(Matched: *${keywordsMatch[0]}*)` :
                  capsMatch ? '(Matched: *<ALL CAPS>*)' :
                  ''
                );
                lastTweet = tweet;
                time = Date.now();
                total++;
              }
              newPublished[tweet.id_str] = true;
            }

          } else {

            sinceId = tweet.id_str;

          }

        }

        published = newPublished;

      }

    }, interval);
    
    const status = () => {

      return {
        type: 'HighScoringTweets',
        screenName,
        name,
        total,
        lastTweet,
        time,
      };

    };

    await this._run(execute, status);
    
  }

  status() {
    return Object.keys(this._tasks)
      .map((id) => this._tasks[id].status())
      .sort((a, b) => {
        
        return (a.type != b.type) ? a.type.localeCompare(b.type) :
          (a.name != null && b.name != null) ? a.name.localeCompare(b.name) : 1;

      });
  }

  async _run(execute, status) {
    this._tasks[Date.now()] = { status };
    await execute();
  }

}

module.exports = function getTaskService() {
  return new TaskService();
};

inject(TaskService);
