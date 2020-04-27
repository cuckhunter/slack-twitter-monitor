/* jshint camelcase: false */

'use strict';

const request = require('request');
const inject = require('./inject');

const NAZI_KEYWORDS = [
  '1488',
  'anschluss',
  'berchtold',
  'bormann',
  'dolchsto(?:ß|ss)',
  'ehrenarier',
  'insatzgruppen',
  'eichmann',
  'endsieg',
  'f[üu]hrerprinzip',
  'gleichschaltung',
  'g[öo]e?ring',
  'gro(?:ß|ss)e l[üu]ge',
  'heydrich',
  '\\bhimmler',
  'ilse koch',
  'judenfrei',
  'lebensborn',
  'lebensraum',
  'l[üu]genpresse',
  'mengele',
  'kristallnacht',
  'night of the long knives',
  'sonderkommando',
];

const KEYWORDS_REG_EXP = new RegExp([
  ...NAZI_KEYWORDS,
  'accelerationis(?:m|ts?)',
  '(?:amy )?wax(?!e[ds]|ing)',
  // 'asperger[\'’]?s|sperg(?:ing|ed|s)?',
  'austere religious scholar',
  // 'autism|autist(?:ic|s)?',
  'baizuo',
  // 'bernie',
  // 'beck(?:ys?|ies)',
  'ben simmons',
  'beta[\\- ]?bu(?:ck|x+)(?:ing|ed|s)?',
  'beta[\\- ]uprising',
  'big,? if true',
  'big league(?! politics)',
  'bigly',
  'bilderberg',
  'bio[\\- ]?diversity',
  // 'black[\\- ]?face',
  'black[\\- ]?swan',
  'blue[\\- ]?dogs?',
  // 'brave(?:ry)?',
  'bug[\\- ]?chasers?',
  'bugm[ae]n',
  'bullock',
  'burn(?:ing|ed|s)? in hell',
  'burn(?:ing|ed|s)? at the stake',
  'catamites?',
  'chad(?!enfreude)s?',
  '\\bchinks?',
  'checkmat(?:ing|e[ds]?)',
  'chop(?:ping|ped|s)? off heads',
  'cissexis[mt]',
  'civnats?',
  // 'cocaine mitch',
  'colonize(?:d|ers?)',
  'controlled opposition',
  '\\bcoon',
  'cordovan',
  // 'cosplay(?:ing|ed|s)?',
  'cotton[\\- ]ceiling',
  'counter[\\- ]?signal(?:l?(s|ing|ed))?',
  'credibly accuse[ds]|credible accusations?',
  'cuck(?!oo)(?:old(?:ry|s|ing|ed)?|s|ing|ed)?',
  '\\bcurry|\\bcurries',
  '(?:james )?damore',
  'dark money',
  'dartmouth',
  'dead[\\- ]?lift(?:s|ing|ed)?',
  'deepfak(?:ing|e[ds]?)',
  'degenerat(?:e[sd]?|ing)',
  'dog[\\- ]?catchers?',
  // '\\bdo\\.? better\\.?',
  'dunk(?:ing|ed|s)? on',
  'easter[\\- ]worship(?:p?ers?)?',
  'economic anxiet(?:ies|y)',
  'ell?iot rod?gers?|\\brodger\\b|supreme gentlem[ae]n',
  'etoro',
  'exploding offer',
  'eugenics?|dysgenics?',
  'evola',
  'faceberg',
  'fag(?:got)?s?',
  // 'fatality',
  'fat[\\- ]?face',
  'final solution',
  'fin[\\- ]?dom',
  'folks\\.{2,}|(?<=^|, )folks(?=\\.|,|$)',
  'fragile masculinity',
  '(?:david )?frum\\b',
  '\\bftm',
  '(?:nick )?fuentes',
  '(?:markelle )?fultz',
  '(?:galaxy|galactic) (?:brain|take)',
  // 'gaslight(?:s|ed|ing)?|gaslit',
  '(?:bill )?\bgates',
  // 'global(?:ists?|ism| elite)',
  'goy(?:s|im)?',
  'grim',
  '\\bhags?\\b',
  '(?<!boko )haram\\b',
  '(?:has |have )?(enter(?:s|ed)?|leaves?|left) the chat',
  '(?:and )?\\bhere[\'’]s why',
  // 'heretic(?:s|al)?',
  // 'hillary',
  'hold my beer',
  // 'homo(?:-?sexual(?:ity|s)?|s)?(?!\\w)',
  // '\\bidw|intellectual dark web',
  'incels?|volcels?',
  '(?:iraqi )?mourners',
  // 'israeli?',
  // '\\biq',
  'iyi',
  '(?:jacob )?\\bwohl\\b',
  'jelq(?:ed|ing|s)?',
  // 'jew(?:s|ish)?',
  'josh allen',
  '\\bjq|jewish question',
  'juul',
  // 'larp(?:p?ing|p?ed|s)?',
  '#LearnToCode|learn(?:s|ed|ing) to code',
  'like (?:a dog|dogs)',
  '\\blord sugar',
  'kafkatrap',
  // 'kashuv',
  'kik(?:e[ds]|ing)',
  'male tears',
  'man[\\- ]?bab(?:ies|y)',
  'many are saying',
  'memory[\- ]?hol(?:e[sd]|ing)',
  'mewing',
  'michael obama',
  'miscegenat(?:ion|ing|es|ed?)',
  '(?:mistake|conflict) theory',
  '\\ba?mog(?!ul)(?:ging|ged|s)?',
  'moslems?',
  'mouthpieces?',
  'move(?:d|s|ing)? the needle',
  '\\bmtf',
  '\\bmuzz(?!le)(?:y|ies)?',
  // 'neo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  // 'neo[\\- ]?lib(?:eral(?:ism|s)?|s)?',
  // '[ny]imby',
  '(?:absolutely |literally )?no(?:body|[\\- ]?one)(?: at all| ever)?:',
  'nofap',
  'normies?',
  '\\bnow do\\b',
  'nrx|moldbug|yarvin|nick land|yudkowsky|less[\\- ]?wrong',
  'nu[\\- ]?male',
  '\\bo[iy] ?(gevalt|vey)',
  'orgy of evidence',
  '\\bown[\\- ]?goals?',
  '\\bp[\\- ]?hacking',
  // '\\bpagan',
  '\\bpajeet',
  'paleo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  'paypig',
  // '\\bpedo(?:phil(?:ia|ic|es?)|s)?',
  'pencil[\\- ]?neck(?:ed|s)?',
  'pepes?(?!\\w)|groypers?|honklers?',
  '((?:red(?![\\- ]?pilled ?america\\b)|blue|black|white)[\\- ]?|(?<![ s]))pill(?!ow)(?:ing|ed|s)?',
  'please clap',
  '\\bpoca\\b|pocahontas',
  'power[\\- ]?law',
  'power[\\- ]?level',
  'psyops?',
  'race[\\- ]mix(?:ing|ed|ers?)?',
  'race[\\- ]?real(?:ism|ists?)',
  'race[\\- ]traitors?',
  'rapefugees?',
  '\\bratio(?!n)(?:[\'’e]?d)?',
  'reddit',
  '#ReleaseTheSnyderCut',
  'rent[\\- ]?seek(?:s|ing|ers?)?|seeking.*\\brent',
  '(?:(republicans?|gop|conservatives?) )?pounce(?:ing|[ds])?',
  'respect your president',
  '(?:ring(?:ing|s)?|rang) true',
  '(?:(?<!a)round|wide)[\\- ]?eyes?',
  '(?:ruth bader )?ginsburg|RBG',
  'sanger',
  // 'schmitt',
  '\\bself[\\- ]?own(?:ing|ed|s)?',
  'shekels?',
  'shitholes?',
  'shoah',
  'shut up and dribble',
  'shylocks?',
  'simp(?:s|ing|ed)?\\b',
  'skin in the game',
  // 'snowflakes?',
  '\\bsnus',
  '\\bso important',
  'sodom(?:y|ites?|ize[ds]?|izing)?',
  'soetoro',
  'sorkin',
  'sources familiar with .* thinking',
  'soy(?!bean)(?:lent|[\\- ]?(?:boy|face))?',
  'spengler',
  'start(?:s|ing|ed)? a (?:conversation|dialogue)',
  'steel[\\- ]?man(?:ning|ned|s)?',
  'street[\\- ]?shit(?:ting|ters?)',
  'subhumans?',
  'sublime',
  '(?:and )?that[\'’]s a good thing',
  'taqiyya',
  'thiel\\b',
  '(?:this|that) ain[\'’]?t it(?:,? chief)?',
  'thots?|#ThotAudit',
  'telegony',
  'tracey',
  'transsexuals?|trann(?:y|ies)',
  'transmisogyn(?:ists?|y)',
  'triple[\\- ]talaq',
  'troons?',
  '\\bttt', // third-tier trash
  'twink(?!le)s?',
  'uncle tom',
  'virtue[\\- ]?signal(?:l?(?:ing|ed|s))?',
  'wagyu',
  'wakandan?',
  '#warrentobiden',
  'watch(?:ing|ed|es)? the film',
  'watch this space',
  '(?:wear(?:ing|s)?|wore) the horns',
  'wejs?',
  'welfare[\\- ]queens?',
  'wife\'s (?:boyfriend|son)',
  'wignats?',
  '(?:chelsea|web(?:b|ster)?) hubbell',
  // 'wuhan[\\- ]?virus',
  // '#YangGang|\\byang(?: ?gang)?',
  'yellow[\\- ]?stone',
  'yinzers?',
  'yu+ge(?:ly)?',
  '\\bzog(?:ged)?',
  // '\\bzio(?:nists?|nism)?',
].join('|'), 'gi');

const ALT_KEYWORDS_REG_EXP = new RegExp([
  'asperger[\'’]?s|sperg(?:ing|ed|s)?',
  // 'autism|autist(?:ic|s)?',
  'beck(?:ys?|ies)',
  'global(?:ists?|ism| elite)',
  'hillary',
  'homo(?:-?sexual(?:ity|s)?|s)?(?!\\w)',
  '\\bidw|intellectual dark web',
  '\\biq',
  // 'israeli?',
  // 'jew(?:s|ish)?',
  'neo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  'neo[\\- ]?lib(?:eral(?:ism|s)?|s)?',
  '\\bpedo(?:phil(?:ia|ic|es?)|s)?',
  // '(?:(republicans?|gop|conservatives?) )?pounce(?:ing|[ds])?',
  // 'virtue[\\- ]?signal(?:l?(?:ing|ed|s))?',
  '\\bzio(?:nists?|nism)?',
].join('|'), 'gi');

console.log(KEYWORDS_REG_EXP);
console.log(ALT_KEYWORDS_REG_EXP);

const ECHOES_REG_EXP = /\({3,}.*\){3,}/g;
const CAPS_REG_EXP = /^[^A-Za-z]*[A-Z]+[^A-Za-z]+[A-Z]+[^a-z]*$/;
const MENTIONS_MATCHES = [
  // 'benshapiro',
  // 'BernieSanders',
  // 'BilLGates',
  // 'BillKristol',
  'davidfrum',
  'DrDavidDuke',
  'ekp',
  'EricRWeinstein',
  // 'ggreenwald',
  // 'jack',
  'JamesADamore',
  'JRubinBlogger',
  // 'KyleKashuv',
  // 'mattyglesias',
  // 'MaxBoot',
  'mtracey',
  // 'NateSilver538',
  // 'neeratanden',
  'NickJFuentes',
  'paulkrugman',
  'RealSkipBayless',
  'robinhanson',
  'tomwatson',
  'tylercowen',
];

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
  user: { followers_count: followersCount },
}, level, protectedUser) {

  const rawScore = protectedUser ? (10 * favoriteCount) : (favoriteCount + 3 * retweetCount);

  const result =
    (level == 'high') ? ((rawScore * 6) / followersCount) :
    (level == 'low') ? (rawScore / (followersCount * 2.5)) :
    (level == 'default' && followersCount > 10000) ? (rawScore / followersCount) :
    (level == 'default' && followersCount > 0) ? (rawScore  / (followersCount * 3)) :
    0;

  return result ;

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

    const interval = 480 * 60 * 1000;

    await new Promise((resolve) => setTimeout(resolve, interval));

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
    [$env, $logger, $slackService, $twitterService],
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

    // debug
    if (!initialTweets.length) {
      $logger.info('No initial tweet', screenName, initialTweets);
      await $slackService.message({
        channel: '#slack-twitter-monitor',
        username: 'debug',
        text: `screenName: ${screenName}, initialTweets: ${JSON.stringify(initialTweets)}`,
      });
    }

    const name = initialTweets.length ? initialTweets[0].user.name : screenName;
    let sinceId = initialTweets.length ? initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str : undefined;
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
            (tweet.user.screen_name != 'RealSkipBayless' || /diet[- ]?dew/i.test(tweet.full_text) || !/@undisputed|today's undisputed podcast/i.test(tweet.full_text)) &&
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

    let { protected: protectedUser } = (await $twitterService.getUser({
      screen_name: screenName,
    }));

    console.log(screenName, protectedUser);
    
    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2,
      protectedUser,
    });

    const interval = ($env.MODE == 'prod') ? (120 * 1000) : (60 * 1000);

    // debug
    if (!initialTweets.length) {
      $logger.info('No initial tweet', screenName, initialTweets);
      await $slackService.message({
        channel: '#slack-twitter-monitor',
        username: 'debug',
        text: `screenName: ${screenName}, initialTweets: ${JSON.stringify(initialTweets)}`,
      });
    }

    const name = initialTweets.length ? initialTweets[0].user.name : screenName;
    let sinceId = initialTweets.length ? initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str : undefined;
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

        for (let i = newTweets.length - 1; i >= 0; i--) {
          
          const tweet = newTweets[i];
          const retweet = tweet.retweeted_status;
          const quotedTweet = retweet ? retweet.quoted_status : tweet.quoted_status;
          const age = now - new Date(tweet.created_at);
          const selfRetweet = retweet && (tweet.user.screen_name == retweet.user.screen_name) && (now - new Date(retweet.created_at) < 24 * 60 * 60 * 1000);
          protectedUser = tweet.user.protected;

          if (!published[tweet.id_str] && !selfRetweet) {

            const score = retweet ? 0 : getScore(tweet, levels[0], protectedUser);
            const matchesMap = {};

            for (const item of [retweet || tweet, quotedTweet]) {

              if (!item) {
                continue;
              }

              let match;

              while (match = ECHOES_REG_EXP.exec(filterTweetText(item))) {
                matchesMap['((()))'] = (~~matchesMap['((()))']) + 1; 
              }

              while (match = KEYWORDS_REG_EXP.exec(filterTweetText(item, true))) {
                // const isHashtag = match[0].charAt(0) == '#';
                // const matchKey = isHashtag ? match[0] : match[0].toLowerCase();
                const matchKey = match[0];
                matchesMap[matchKey] = (~~matchesMap[matchKey]) + 1;
              }

              for (const mention of item.entities.user_mentions) {
                
                if (
                  MENTIONS_MATCHES.some((screenName) => mention.screen_name.toLowerCase() == screenName.toLowerCase()) &&
                  mention.screen_name != tweet.user.screen_name &&
                  !(retweet && item == quotedTweet && mention.screen_name == retweet.user.screen_name)
                ) {
                  const matchKey = '@' + mention.screen_name;
                  matchesMap[matchKey] = (~~matchesMap[matchKey]) + 1;
                }
              }

            }

            const matches = Object.entries(matchesMap).map(([key, val]) => {
              return (val > 1) ? `*${key}* x${val}` : `*${key}*`;
            });

            const greenwald = (tweet.user.screen_name == 'ggreenwald' && tweet.lang == 'pt');

            if (!greenwald && (score >= MIN_SCORE || matches.length)) {

              await $slackService.publish(
                [tweet],
                (matches.length ? `(Matched: ${matches.join(', ')})` : '') +
                (protectedUser ? `\n>${tweet.full_text.replace(/\n/g, '\n>')}` : '')
              );
              lastTweet = tweet;
              time = Date.now();
              total++;

              published[tweet.id_str] = true;

            }

          }

          if ((age + interval) >= MAX_AGE) {

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

            delete published[tweet.id_str];
            sinceId = tweet.id_str;

          }

        }

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
