/* jshint camelcase: false */

'use strict';

const request = require('request');
const inject = require('./inject');

const KEYWORDS_REG_EXP = new RegExp('(?<!@\\w*|://\\S*)(?:' + [
  '1488',
  'baizuo',
  // 'bernie',
  'bio[\\- ]?diversity',
  'black ?swan',
  'blue ?dog',
  'bug ?chaser',
  'bugman|bugmen',
  'burn(?:ing|ed|s)? in hell',
  'burn(?:ing|ed|s)? at the stake',
  'chad',
  'chop(?:ping|ped|s)? off heads',
  'cocaine mitch',
  // 'cookie',
  'cordovan',
  'cuck(?:old(?:ry|s)?|s)?',
  'curry|curries',
  'dartmouth',
  'dead ?lift',
  'degenerat\\w*',
  'dog catcher',
  'ell?iot rod?gers?|\\brodger\\b|supreme gentlem[ae]n',
  'etoro',
  'exploding offer',
  'evola',
  'fag\\w*',
  'fultz',
  'global(?:ists?|ism| elite)',
  '\\bhimmler|mengele|g[öo]e?ring|ilse koch|berchtold|bormann|heydrich',
  'anschluss|dolchsto(?:ß|ss)|ehrenarier|einsatzgruppen|endsieg|f[üu]hrerprinzip|gleichschaltung|gro(?:ß|ss)e l[üu]ge|judenfrei|lebensborn|lebensraum|l[üu]genpresse',
  'goy(?:s|im)?',
  '\\bhags?\\b',
  'haram\\b',
  'hillary',
  '(?:and )?\\bhere\'s why',
  'heretic(?:s|al)?',
  'incels?|volcels?',
  // 'israeli?',
  '\\biq',
  'jelq(?:s|ed|ing)?',
  // 'jew(?:s|ish)?',
  'josh allen',
  '\\bjq',
  '#LearnToCode',
  'like a dog',
  'kike',
  'many are saying',
  'miscegenat(?:es?|ion)',
  'moldbug|yarvin|nick land',
  'neo-?cons?',
  'neo[\\- ]?lib(?:eral)?s?',
  'nofap',
  'orgy of evidence',
  '\\bpagan',
  'paleo[\\- ]?con(?:servative)?s?',
  'pepes?|groypers?',
  '(?!<\\w)pill(?:s|ing|ed)?',
  // 'pizza',
  'power law',
  'rent[\\- ]?seek(?:s|ing)?|seeking.*\\brent',
  '(?:ring(?:ing|s)?|rang) true',
  'schmitt',
  'shekels?',
  'shitholes?',
  'shut up and dribble',
  'snus',
  'sodom(?:y|ites?|ize[ds]?|izing)?',
  'soetoro',
  'soy(?!bean)(?:lent| ?boy| ?face)?',
  'spengler',
  'steel ?man(?:ning|ned|s)?',
  '(?:and )?that\'s a good thing',
  'thiel',
  'thots?',
  'telegony',
  'transsexual|tranny|trannies',
  'watch(?:ing|ed|es)? the film',
  '(?:wear(?:ing|s)?|wore) the horns',
  '(?:chelsea|web(?:b|ster)?) hubbell',
  '\\bzio(?:nists?|nism)?',
].join('|') + ')', 'gi');

console.log(KEYWORDS_REG_EXP);

const CAPS_REG_EXP = /^[^A-Za-z]*[A-Z]+[^A-Za-z]+[A-Z]+[^a-z]*$/;

function setPoll(fn, interval) {
  
  return async function poll() {
    
    await fn();

    await new Promise((resolve) => {
      setTimeout(resolve, interval);
    });

    return poll(fn, interval);

  };

}


function getScore({
  favorite_count: favoriteCount,
  retweet_count: retweetCount,
  user: { followers_count: followersCount }
}, level, protectedUser) {

  const rawScore = protectedUser ? (10 * favoriteCount) : (favoriteCount + 3 * retweetCount);

  const result =
    (level == 'high') ? ((rawScore * 6) / followersCount) :
    (level == 'low') ? (rawScore / (followersCount * 2.5)) :
    (followersCount > 10000) ? (rawScore / followersCount) :
    (followersCount > 0) ? (rawScore  / (followersCount * 3)) :
    0;

  return result;

}

const TWEET_FILTERS = {
  hashtags: (tweet, text) => {
    for (const hashtag of tweet.entities.hashtags) {
      text = text.replace(new RegExp(hashtag.text, 'i'), '');
    }
    return text;
  },
  symbols: (tweet, text) => {
    for (const symbol of tweet.entities.symbols) {
      text = text.replace(new RegExp('$' + symbol.text, 'i'), '');
    }
    return text;
  },
  userMentions: (tweet, text) => {
    for (const userMention of tweet.entities.user_mentions) {
      text = text.replace(new RegExp('@' + userMention.screen_name, 'i'), '');
    }
    return text;
  },
  urls: (tweet, text) => {
    for (const url of tweet.entities.urls) {
      text = text.replace(new RegExp(url.url, 'i'), '');
    }
    return text;
  },
  media: (tweet, text) => {
    for (const media of (tweet.extended_entities ? tweet.extended_entities.media : [])) {
      text = text.replace(new RegExp(media.url, 'i'), '');
    }
    return text;
  },
};

function filterTweetText(tweet, includeHashtags = false) {

  return Object.entries(TWEET_FILTERS).reduce((memo, [type, filter]) => {

    if (includeHashtags && type == 'hashtags') {
      return memo;
    }

    return filter(tweet, memo);

  }, tweet.full_text);

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

    const protectedUser = (await $twitterService.getUser({
      screen_name: screenName,
    })).protected;

    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2,
      protectedUser,
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
        protectedUser,
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
   * High scoring tweets from user
   * 
   * @param  {String} screenName
   * @param  {String} (level)
   */
  async runHighScoringTweetsTask([$env, $logger, $slackService, $twitterService], screenName, level) {

    const MAX_AGE = 6 * 60 * 1000;
    const MIN_SCORE = 0.0012;

    const protectedUser = (await $twitterService.getUser({
      screen_name: screenName,
    })).protected;
    
    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2,
      protectedUser,
    });

    const interval = ($env.MODE == 'prod') ? (120 * 1000) : (60 * 1000);

    // debug
    if (!initialTweets[0]) {
      $logger.info('No initial tweet', screenName, initialTweets);
      await $slackService.message({
        channel: '#slack-twitter-monitor',
        username: 'debug',
        text: `screenName: ${screenName}, initialTweets: ${JSON.stringify(initialTweets)}`,
      });
    }

    const yg = (screenName == 'mattyglesias' && !initialTweets.length);

    const name = yg ? 'mattyglesias' : initialTweets[0].user.name;
    let sinceId = yg ? undefined : initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweet;
    let time;
    let published = {};
    
    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getUserTimeline({
        screen_name: screenName,
        include_rts: true,
        since_id: sinceId,
        protectedUser,
      });

      if (newTweets.length) {

        const now = Date.now();
        const newPublished = {};

        for (let i = newTweets.length - 1; i >= 0; i--) {
          
          const tweet = newTweets[i];
          const retweet = tweet.retweeted_status;
          const quotedTweet = retweet ? retweet.quoted_status : tweet.quoted_status;
          const age = now - new Date(tweet.created_at);
          
          if (age < MAX_AGE) {

            const score = retweet ? 0 : getScore(tweet, level, protectedUser);
            const matchesMap = {};

            for (const item of [retweet || tweet, quotedTweet]) {

              if (!item) {
                continue;
              }

              let match;

              if (CAPS_REG_EXP.test(filterTweetText(item))) {
                matchesMap['<ALL CAPS>'] = (~~matchesMap['<ALL CAPS>']) + 1;
              }

              while (match = KEYWORDS_REG_EXP.exec(filterTweetText(item, true))) {
                // const isHashtag = match[0].charAt(0) == '#';
                // const matchKey = isHashtag ? match[0] : match[0].toLowerCase();
                const matchKey = match[0];
                matchesMap[matchKey] = (~~matchesMap[matchKey]) + 1;
              }

            }

            const matches = Object.entries(matchesMap).map(([key, val]) => {
              return (val > 1) ? `*${key}* x${val}` : `*${key}*`;
            });

            if (score >= MIN_SCORE || matches.length) {
              if (!published[tweet.id_str]) {

                await $slackService.publish(
                  [tweet],
                  (matches.length ? `(Matched: ${matches.join(', ')})` : '') +
                  (protectedUser ? `\n>${tweet.full_text.replace(/\n/g, '\n>')}` : '')
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

  /**
   * Best tweets from user's home timeline
   */
  // async runBestTweetsTask([$env, $slackService, $twitterService]) {

  //   const initialTweets = await $twitterService.getHomeTimeline({
  //     include_rts: true,
  //     count: 2,
  //   });

  //   const interval = ($env.MODE == 'prod') ? (120 * 60 * 1000) : (60 * 1000);
  //   let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
  //   let total = 0;
  //   let lastTweet;
  //   let time;

  //   const execute = setPoll(async () => {

  //     const newTweets = await $twitterService.getHomeTimeline({
  //       include_rts: true,
  //       since_id: sinceId
  //     });

  //     if (newTweets.length) {

  //       await $slackService.publish([newTweets[0]]);
       
  //       sinceId = newTweets[0].id_str;
  //       lastTweet = newTweets[0];
  //       time = Date.now();
  //       total++;

  //     }

  //   }, interval);

  //   const status = () => {
      
  //     return {
  //       type: 'BestTweets',
  //       total,
  //       lastTweet,
  //       time,
  //     };

  //   }

  //   await this._run(execute, status);

  // }

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
