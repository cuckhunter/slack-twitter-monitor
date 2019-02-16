/* jshint camelcase: false */

'use strict';

const request = require('request');
const inject = require('./inject');

const KEYWORDS_REG_EXP = new RegExp([
  '1488|anschluss|dolchsto(?:ß|ss)|ehrenarier|einsatzgruppen|endsieg|f[üu]hrerprinzip|gleichschaltung|gro(?:ß|ss)e l[üu]ge|judenfrei|lebensborn|lebensraum|l[üu]genpresse|wehrmacht',
  'accelerationis[mt]',
  'asperger\'?s|sperg(?:ing|ed|s)?',
  'autism|autists?',
  'baizuo',
  // 'bernie',
  'beck(?:ys?|ies)',
  'beta[\\- ]?bu(?:ck|x+)(?:ing|ed|s)?',
  'beta uprising',
  'bigly|big league',
  'bilderberg',
  'bio[\\- ]?diversity',
  'black[\\- ]?face',
  'black[\\- ]?swan',
  'blue[\\- ]?dogs?',
  'bug[\\- ]?chasers?',
  'bugman|bugmen',
  'burn(?:ing|ed|s)? in hell',
  'burn(?:ing|ed|s)? at the stake',
  'catamites?',
  'chad(?:s )?',
  '\\bchinks?',
  'checkmat(?:ing|e[ds]?)',
  'chop(?:ping|ped|s)? off heads',
  'cissexis[mt]',
  'civnats?',
  'cocaine mitch',
  'colonize(?:d|ers?)',
  'cordovan',
  'cosplay(?:ing|ed|s)?',
  'cotton[\\- ]ceiling',
  'credibly accuse[ds]|credible accusations?',
  'cuck(?!oo)(?:old(?:ry|s)?|s\\b)?',
  'curry|curries',
  'dartmouth',
  'dead ?lift',
  'deepfak(?:ing|e[ds]?)',
  'degenerat\\w*',
  'dog[\\- ]?catchers?',
  'economic anxiet(?:ies|y)',
  'ell?iot rod?gers?|\\brodger\\b|supreme gentlem[ae]n',
  'etoro',
  'exploding offer',
  'eugenics?|dysgenics?',
  'evola',
  'fag(?:got)?s?',
  'fatality',
  'fragile masculinity',
  '\\bftm',
  'fultz',
  'galactic (?:brain|take)',
  'ginsburg|RBG',
  'global(?:ists?|ism| elite)',
  '\\bhimmler|mengele|g[öo]e?ring|ilse koch|berchtold|bormann|heydrich',
  'goy(?:s|im)?',
  '\\bhags?\\b',
  'haram\\b',
  '(?:and )?\\bhere\'s why',
  'heretic(?:s|al)?',
  // 'hillary',
  'hold my beer',
  'homo(?:-?sexual(?:ity|s)?|s)?(?!\\w)',
  '\\bidw|intellectual dark web',
  'incels?|volcels?',
  // 'israeli?',
  '\\biq',
  'jelq(?:ed|ing|s)?',
  // 'jew(?:s|ish)?',
  'josh allen',
  '\\bjq',
  'larp(?:p?ing|p?ed|s)?',
  '#LearnToCode',
  'like a dog',
  '\\blord sugar',
  'kafkatrap',
  'kik(?:e[ds]|ing)',
  'male tears',
  'man[\\- ]bab(?:ies|y)',
  'many are saying',
  'michael obama',
  'miscegenat(?:ion|ing|es?)',
  '(?:mistake|conflict) theory',
  '(?<=\\b)a?mog(?:ging|ged|s)?',
  'moslems?',
  'mouthpieces?',
  '\\bmtf',
  '\\bmuzz(?:y|ies)?',
  // 'neo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  // 'neo[\\- ]?lib(?:eral(?:ism|s)?|s)?',
  '[ny]imby',
  'nofap',
  'normies?',
  'nrx|moldbug|yarvin|nick land',
  'nu[\\- ]?male',
  '\\boy ?vey',
  'orgy of evidence',
  '\\bown[\\- ]?goals?',
  '\\bp[\\- ]?hacking',
  '\\bpagan',
  '\\bpajeet',
  'paleo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  'pedo(?:phil(?:ia|ic|es?)|s)?',
  'pencil[\\- ]?neck(?:ed|s)?',
  'pepes?(?!\\w)|groypers?',
  '((?:red|blue|black|white)[\\- ]?|(?<! ))pill(?:ing|ed|s)?',
  // 'pizza',
  'please clap',
  '\\bpoca\\b|pocahontas',
  'power[\\- ]?law',
  'power[\\- ]?level',
  'psyops?',
  'race[\\- ]mix(?:ing|ed|ers?)?',
  'race[\\- ]?real(?:ism|ists?)',
  'rapefugees?',
  'rent[\\- ]?seek(?:s|ing)?|seeking.*\\brent',
  '(?:(republicans?|gop|conservatives?) )?pounce(?:ing|[ds])?',
  'respect your president',
  '(?:ring(?:ing|s)?|rang) true',
  '(?:(?<!a)round|wide)[\\- ]?eyes?',
  'schmitt',
  '\\bself[\\- ]?own(?:ing|ed|s)?',
  'sex[\\- ]flesh',
  'shekels?',
  'shitholes?',
  'shoah',
  'shut up and dribble',
  'shylocks?',
  '\\bsnus',
  '\\bso important',
  'sodom(?:y|ites?|ize[ds]?|izing)?',
  'soetoro',
  'sorkin',
  'sources familiar with .* thinking',
  'soy(?!bean)(?:lent|[\\- ]?(?:boy|face))?',
  'spengler',
  'started a (?:conversation|dialogue)',
  'steel[\\- ]?man(?:ning|ned|s)?',
  'street[\\- ]?shit(?:ting|ters?)',
  'subhumans?',
  'sublime',
  '(?:and )?that\'s a good thing',
  'taqiyya',
  'thiel\\b|peter teal',
  'thots?|#ThotAudit',
  'telegony',
  'transsexual|tranny|trannies',
  'transmisogyn(?:ists?|y)',
  'troons?',
  '\\bttt',
  'twink(?!le)s?',
  'virtue[\\- ]?signal(?:l?(?:ing|ed|s))?',
  'wagyu',
  'wakandan?',
  'watch(?:ing|ed|es)? the film',
  '(?:wear(?:ing|s)?|wore) the horns',
  'wejs?',
  'welfare[\\- ]?queens?',
  'wignats?',
  '(?:chelsea|web(?:b|ster)?) hubbell',
  'yinzers?',
  '\\bzog(?:ged)?',
  // '\\bzio(?:nists?|nism)?',
].join('|'), 'gi');

const ALT_KEYWORDS_REG_EXP = new RegExp([
  'hillary',
  'israeli?',
  'jew(?:s|ish)?',
  'neo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  'neo[\\- ]?lib(?:eral(?:ism|s)?|s)?',
  '\\bzio(?:nists?|nism)?',
].join('|'), 'gi');

console.log(KEYWORDS_REG_EXP);
console.log(ALT_KEYWORDS_REG_EXP);

const ECHOES_REG_EXP = /\({3,}.*\){3,}/;
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
    (level == 'default' && followersCount > 10000) ? (rawScore / followersCount) :
    (level == 'default' && followersCount > 0) ? (rawScore  / (followersCount * 3)) :
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
   * @param  {Array<String>} (levels)
   */
  async runHighScoringTweetsTask([$env, $logger, $slackService, $twitterService], screenName, levels) {

    const MAX_AGE = 6 * 60 * 1000;
    const MIN_SCORE = 0.0012;

    let protectedUser = (await $twitterService.getUser({
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
          protectedUser = tweet.user.protected;
          
          if (age < MAX_AGE) {

            const score = retweet ? 0 : getScore(tweet, levels[0], protectedUser);
            const matchesMap = {};

            for (const item of [retweet || tweet, quotedTweet]) {

              if (!item) {
                continue;
              }

              let match;

              // if (CAPS_REG_EXP.test(filterTweetText(item))) {
              //   matchesMap['<ALL CAPS>'] = (~~matchesMap['<ALL CAPS>']) + 1;
              // }

              if (ECHOES_REG_EXP.test(filterTweetText(item))) {
               matchesMap['((()))'] = (~~matchesMap['((()))']) + 1; 
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
            
            if (!published[tweet.id_str]) {

              const score = retweet ? 0 : getScore(tweet, levels[1], protectedUser);
              const matchesMap = {};

              for (const item of [retweet || tweet, quotedTweet]) {

                if (!item) {
                  continue;
                }

                let match;

                if (CAPS_REG_EXP.test(filterTweetText(item))) {
                  matchesMap['<ALL CAPS>'] = (~~matchesMap['<ALL CAPS>']) + 1;
                }

                while (match = ALT_KEYWORDS_REG_EXP.exec(filterTweetText(item, true))) {
                  const matchKey = match[0];
                  matchesMap[matchKey] = (~~matchesMap[matchKey]) + 1;
                }

              }

              const matches = Object.entries(matchesMap).map(([key, val]) => {
                return (val > 1) ? `*${key}* x${val}` : `*${key}*`;
              });

              if (score >= MIN_SCORE || matches.length) {

                await $slackService.publish(
                  [tweet],
                  (matches.length ? `(Matched: ${matches.join(', ')})` : '') +
                  (protectedUser ? `\n>${tweet.full_text.replace(/\n/g, '\n>')}` : ''),
                  '#zeroboat'
                );
                lastTweet = tweet;
                time = Date.now();
                total++;

              }

            }

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
