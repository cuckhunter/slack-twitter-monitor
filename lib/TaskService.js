/* jshint camelcase: false */

'use strict';

const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
const request = require('request');
const inject = require('./inject');

const NAZI_KEYWORDS = [
  '1488',
  'anschlu(?:ß|ss)',
  'berchtold',
  'bormann',
  'dolchsto(?:ß|ss)',
  'drang nach osten',
  'ehrenarier',
  'einsatzgruppen',
  'eichmann',
  'endsieg',
  'f[üu]hrerbunker',
  'f[üu]hrerprinzip',
  'generalplan ost',
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
  'sturmabteilung',
];

const KEYWORDS_REG_EXP = new RegExp([
  ...NAZI_KEYWORDS,
  'accelerationis(?:m|ts?)',
  'a ?la ?carte?',
  'amy wax',
  // 'asperger[\'’]?s|sperg(?:ing|ed|s)?',
  'austere religious scholar',
  'autism|autist(?:ic|s)?',
  'auto[\\- ]?admit|xoxohth|(?:blake )?\\bneff(?:\'s)?\\b',
  'baizuo',
  // 'beck(?:ys?|ies)',
  'belichick',
  'bernie',
  'ben simmons',
  'beta[\\- ]?bu(?:ck|x+)(?:ing|ed|s)?',
  'beta[\\- ]uprising',
  'big,? if true',
  'big league(?! politics)',
  'bigly',
  'bilderberg',
  'bio[\\- ]?leninis[mt]',
  // 'black[\\- ]?face',
  '(?:black|brown|female|gay|left|lesbian|liberal|trans|jewish|muslim)[\\- ]?fragility',
  // 'black[\\- ]?swan',
  'blue[\\- ]?dogs?',
  // 'brave(?:ry)?',
  'broke:|woke:|bespoke:',
  'bug[\\- ]?chasers?',
  'bugm[ae]n',
  'bullock',
  // 'burn(?:ing|ed|s)? in hell',
  // 'burn(?:ing|ed|s)? at the stake',
  'call(?:s|ed|ing)? (?:a )?lids?',
  'catamites?',
  // 'chad(?!enfreude)s?',
  '\\bchinks?',
  'checkmat(?:ing|e[ds]?)',
  'chop(?:ping|ped|s)? off heads',
  'cissexis[mt]',
  'civnats?',
  'clarence thomas',
  'cocaine mitch',
  'colonize(?:d|ers?)',
  'controlled opp(?:osition)?',
  '\\bcoon(?!ey)(?:s|ing)?',
  // '(?:sam )?coonrod',
  'cordovan',
  'cosplay(?:ing|ed|s)?',
  'cotton[\\- ]ceiling',
  'counter[\\- ]?signal(?:l?(s|ing|ed))?',
  'credibly accuse[ds]|credible accusations?',
  '(?:the )?cruelty is the point',
  'cuck(?!oo)(?:old(?:ry|s|ing|ed)?|s(ervatives?)?|ing|ed)?',
  // '\\bcurry|\\bcurries',
  '(?:james )?damore',
  // 'dark money',
  'dartmouth',
  'dead[\\- ]?lift(?:s|ing|ed)?',
  'dead[\\- ]?nam(?:e[ds]?|ing)',
  'deceptive(?:ly)? edit(?:s|ed|ing)?',
  // 'deepfak(?:ing|e[ds]?)',
  'degenerat(?:e[ds]?|ing)',
  // '\\bdo\\.? better\\.?',
  'dog[\\- ]?catchers?',
  // 'dominion',
  // 'dunk(?:ing|ed|s)? on',
  'easter[\\- ]worship(?:p?ers?)?',
  // 'economic anxiet(?:ies|y)',
  'ell?iot rod?gers?|\\brodger\\b|supreme gentlem[ae]n',
  '\\betoro',
  'exploding offer',
  // 'eugenics?|dysgenics?',
  'evola',
  'faceberg',
  'fag(?:got)?s?\\b',
  // 'fatality',
  'fat[\\- ]?face',
  'final solution',
  'fin[\\- ]?dom',
  'folks\\.{2,}|(?<=^|, )folks(?=\\.|,|$)',
  'forced birth',
  '(?:david )?frum(?:\'s)?\\b',
  '\\bftm',
  '(?:nick )?fuentes',
  '(?:markelle )?fultz',
  '(?:galaxy|galactic) (?:brain|take)',
  // 'gaslight(?:s|ed|ing)?|gaslit',
  '(?:bill )?\\bgates',
  // '(?:gina )?carano',
  // 'global(?:ists?|ism| elite)',
  'goy(?:s|im|ische)?\\b',
  // 'grappl(?:e[ds]?|ing)(?: with)?',
  // 'grift(?:s|ed|ing|ers?)?',
  // '(?<!pil)grim',
  // '\\bhags?\\b',
  '(?<!boko )\\bharam\\b',
  '(?:has |have )?(enter(?:s|ed)?|leaves?|left) the chat',
  // '(?:and )?\\bhere[\'’]?s why|here[\'’]?s how',
  // 'heretic(?:s|al)?',
  // 'hillary',
  'hold my beer',
  '(globo[\\- ]?)?homos?\\b',
  '(?:human )?bio[\\- ]?diversity',
  // '\\bidw|intellectual dark web',
  'incels?|volcels?',
  'iraqi mourners',
  // 'israeli?',
  // '\\biq',
  '\\biyi',
  '(?:jacob )?\\bwohl\\b',
  'jelq(?:ed|ing|s)?',
  // 'jew(?:s|ish)?',
  'joggers?',
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
  // 'kwame(?: ?brown)?',
  'let(?:\'s| us| me) be clear',
  // 'male tears',
  // 'man[\\- ]?bab(?:ies|y)',
  'many are saying',
  'material liberation|liberat(?:e[ds]?|ing) materials?',
  'memory[\\- ]?hol(?:e[sd]|ing)',
  '\\bmew(?:s|ed|ing)?',
  'big mike|michael obama',
  'miscegenat(?:ion|ing|es|ed?)',
  '(?:mistake|conflict) theory',
  '\\ba?mog(?!ul)(?:ging|ged|s)?',
  'moslems?',
  'mouthpieces?',
  'move(?:d|s|ing)? the needle',
  '\\bmtf',
  '\\bmuzz(?!le|ling)(?:y|ies)?',
  // 'neo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  // 'neo[\\- ]?lib(?:eral(?:ism|s)?|s)?',
  // '[ny]imby',
  '(?:absolutely |literally )?no(?:body|[\\- ]?one)(?: at all| ever)?:',
  'nofap',
  // 'norm\\b(?: ma?cdonald)?',
  // 'normies?',
  '\\bnow do\\b',
  'nrx|moldbug|yarvin|nick land|yudkowsky|less[\\- ]?wrong',
  'nu[\\- ]?male',
  '(?:shohei )?ohtani',
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
  'pepes?\\b|groypers?|honklers?',
  '((?:red(?![\\- ]?pilled ?america\\b)|blue|black|white|clear)[\\- ]?|(?<![ s]))pill(?!ow)(?:ing|ed|s)?',
  'pizza[\\- ]gate',
  'please clap',
  '\\bpoca\\b|pocahontas',
  '(?:dave )?portnoy',
  'power[\\- ]?law',
  'power[\\- ]?level',
  '(?:(?:all the )?(?:hall|ear)marks of (?:a )?)?russian disinfo(?:rmation)?(?: (?:campaign|op(?:eration)?))?', // has to precede 'information op'
  'psy[\\- ]?ops?|info(?:rmation)?[\\- ]?ops?',
  'race[\\- ]mix(?:ing|ed|ers?)?',
  'race[\\- ]?real(?:ism|ists?)',
  'race[\\- ]traitors?',
  'rapefugees?',
  // '\\bratio(?!n)(?:[\'’e]?d)?',
  'read(?:s|ing)? the room',
  // 'reddit',
  '#ReleaseTheAyerCut',
  '#ReleaseTheS(?:ny|yn)derCut',
  'rent[\\- ]?seek(?:s|ing|ers?)?|seeking rent',
  '(?:(republicans?|gop|conservatives?) )?pounc(?:ing|e[ds]?)',
  'respect your president',
  '(?:ring(?:ing|s)?|rang) true',
  '(?:aaron )?rodgers',
  '(?:(?<!a)round|wide)[\\- ]?eyes?',
  '(?:ruth bader )?ginsb[ue]rg|RBG',
  // '(?:margaret )?sanger',
  'sa(?:y(?:s|ing)?|id) the quiet part out loud',
  // 'schmitt',
  '\\bself[\\- ]?own(?:ing|ed|s)?',
  'shekels?',
  'shitholes?',
  'shoah',
  'shut up and dribble',
  'shylocks?',
  // 'shot:|chaser:',
  // 'simp(?:s|ing|ed)?\\b',
  'skin in the game',
  // 'snowflakes?',
  '\\bsnus',
  '\\bso important',
  'sodom(?:y|ites?|ize[ds]?|izing)?',
  '(?:barry )?soetoro',
  'sorkin',
  'sources familiar with .* thinking',
  'soy(?!bean)(?:lent|[\\- ]?(?:boy|face))?',
  'spengler',
  'start(?:s|ing|ed)? a (?:conversation|dialogue)',
  'steel[\\- ]?man(?:ning|ned|s)?',
  'street[\\- ]?shit(?:ting|ters?)',
  'subhumans?',
  'sublime',
  // 'taiwan',
  'take the l\b',
  'taqq?iyy?a',
  '(?:and )?that[\'’]s a good thing',
  'that\'s it. that\'s the tweet.',
  'thiel\\b',
  '(?:this|that) ain[\'’]?t it(?:,? chief)?',
  'thots?|#ThotAudit',
  'telegony',
  'tom watston',
  '(?:michael )?tracey',
  'transsexuals?|trann(?:y|ies)',
  'transmisogyn(?:ists?|y)',
  'triple[\\- ]talaq',
  'troons?',
  '\\bttt', // third-tier trash
  'twink(?!le)s?',
  'uncle tom',
  // 'virtue[\\- ]?signal(?:l?(?:ing|ed|s))?',
  'wagyu',
  // 'wakandan?',
  '#warrentobiden',
  'watch(?:ing|ed|es)? the film',
  'watch this space',
  'wayfair',
  '(?:wear(?:ing|s)?|wore) the horns',
  '(?:chelsea|web(?:b|ster)?) hubbell',
  'wejs?',
  'welfare[\\- ]queens?',
  '(?:carson )?wentz',
  'wife\'s (?:boyfriend|son)',
  'wignats?',
  'wuhan[\\- ]?virus',
  // '#YangGang|\\byang(?: ?gang)?',
  'yellow[\\- ]?stone',
  'yinzers?',
  'you(?: absolutely)? (?:love|hate) to see it',
  'yu+ge(?:ly)?',
  // 'zack s(?:ny|yn)der',
  '\\bzog(?:ged)?',
  // '\\bzio(?:nists?|nism)?',
].join('|'), 'gi');

const ALT_KEYWORDS_REG_EXP = new RegExp([
  'asperger[\'’]?s|sperg(?:ing|ed|s)?',
  // 'autism|autist(?:ic|s)?',
  'beck(?:ys?|ies)',
  'global(?:ists?|ism| elite)',
  'hillary',
  'homo(?:-?sexual(?:ity|s)?|s)?\\b',
  '\\bidw|intellectual dark web',
  '\\biq',
  // 'israeli?',
  // 'jew(?:s|ish)?',
  'neo[\\- ]?con(?:servativ(?:ism|es?)|s)?',
  'neo[\\- ]?lib(?:eral(?:ism|s)?|s)?',
  // '\\bpedo(?:phil(?:ia|ic|es?)|s)?',
  // '(?:(republicans?|gop|conservatives?) )?pounce(?:ing|[ds])?',
  'taiwan',
  // 'virtue[\\- ]?signal(?:l?(?:ing|ed|s))?',
  '\\bzio(?:nists?|nism)?',
].join('|'), 'gi');

console.log(KEYWORDS_REG_EXP);
console.log(ALT_KEYWORDS_REG_EXP);

const ECHOES_REG_EXP = /\({3,}.*\){3,}/g;
const CAPS_REG_EXP = /^[^A-Za-z]*[A-Z]+[^A-Za-z]+[A-Z]+[^a-z]*$/;
const MENTIONS_MATCHES = [
  'Vermeullarmine',
  // 'benshapiro',
  // 'BernieSanders',
  // 'BilLGates',
  // 'BillKristol',
  'davidfrum',
  'DrDavidDuke',
  'ekp',
  'EricRWeinstein',
  // 'ginacarano',
  'ggreenwald',
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
  'ScottAdamsSays',
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
  user: { followers_count: followerCount },
}, level, protectedUser) {

  // const adjustment = (followerCount < 10000) ? 0.5 : 1;
  const adjustment = (followerCount < 10000) ? (followerCount / 100000) * 5 : 1; 
  const score = (
      protectedUser ?
      (8 * favoriteCount) :
      ((favoriteCount + 3 * retweetCount) * adjustment)
    ) / 1.5;

  const result =
    (level == 'none') ? 0 :
    (level == 'low') ? ((score * 0.5) / followerCount) :
    (level == 'high') ? ((score * 6) / followerCount) :
    (score / followerCount);

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
  
  async runTrumpDeskTask([$slackService]) {
    
    const interval = 10 * 60 * 1000;

    const body = await new Promise((resolve, reject) => {

      cloudscraper({
        url: `https://www.donaldjtrump.com/desk`,
        timeout: 60000,
      }, (err, response, body) => {
        if (err) {
          reject(new Error(JSON.stringify({err, response, body})));
        } else {
          resolve(body);
        }
      });

    });

    let lastId = Math.max(...cheerio.load(body)('.ftdli').map((index, item) => cheerio(item).data('id')).get());
    let time;

    const execute = setPoll(async () => {

      const body = await new Promise((resolve, reject) => {

        cloudscraper({
          url: `https://www.donaldjtrump.com/desk`,
          timeout: 60000,
        }, (err, response, body) => {
          if (err) {
            reject(new Error(JSON.stringify({err, response, body})));
          } else {
            resolve(body);
          }
        });

      });
      
      const $root = cheerio.load(body);
      const $posts = $root('.ftdli');
      const posts = [];
      
      $posts.each((index, item) => {
        const $post = cheerio(item);
        if ($post.data('id') > lastId) {
          posts.push({
            id: $post.data('id'),
            date: $post.find('.date p').text(),
            text: $post.find('.ftd-post-text').text(),
            imgs: $post.find('.ftdli-main-content img').map((index, item) => cheerio(item).attr('src')).get(),
          });
        }
      });
      
      if (posts.length) {
        
        lastId = Math.max(...posts.map(post => post.id));
      
        const results = posts.map((post) => {
          let result = `_${post.date}_`;
          if (post.text) {
            result += '\n\n' + post.text.replace(/(?:<br ?\/?>\s*)+/g, '\n\n');
          }
          if (post.imgs.length) {
            result += '\n\n' + post.imgs.join('\n');
          }
          return result;
        });
                                  
        for (let i = posts.length - 1; i >= 0; i--) {
          const result = results[i];
          await $slackService.message({
            username: 'Trump Desk',
            text: result,
          });
        }
        
      }

    }, interval);

    const status = () => {

      return {
        type: 'TrumpDesk',
        time,
      };

    }

    time = Date.now();
    await this._run(execute, status);

  }

  async runPredictItTask([$slackService], id) {

    const interval = 240 * 60 * 1000;

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

      // await $slackService.message({
      //   channel: '#slack-twitter-monitor',
      //   username: 'debug',
      //   text: body.slice(0, 1000),
      // });

      const market = JSON.parse(body);
      
      // temporary condition for 2020 election
      market.contracts = market.contracts.filter((contract) => {
        return contract.lastTradePrice > 0.01;
      });

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

    // // debug
    // console.log(KEYWORDS_REG_EXP);
    // console.log(
    //   JSON.stringify(
    //     await $twitterService.getTweet({ id: '1257712054871474178', protected: true }),
    //     null,
    //     2)
    // );

    const {name, protected: protectedUser} = (await $twitterService.getUser({
      screen_name: screenName,
    }));

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
        channel: 'logging',
        username: 'debug',
        text: `screenName: ${screenName}, initialTweets: ${JSON.stringify(initialTweets)}`,
      });
    }

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
      
      const now = Date.now();

      if (newTweets.length) {

        const tweets = [];

        for (let i = 0; i < newTweets.length; i++) {
          let tweet = newTweets[i];
          if (
            (sinceId != null || (now - new Date(tweet.created_at) < interval * 5)) &&
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
   * Mentions of a user
   *
   * @param  {String} screenName
   * @param  {Number} (modulus)
   */
  async runMentionsTask(
    [$env, $logger, $slackService, $twitterService],
    screenName,
    modulus = 1,
  ) {

    const name = (await $twitterService.getUser({
      screen_name: screenName,
    })).name;


    const initialTweets = await $twitterService.getSearch({
      q: `to:${screenName}`,
      recent: true,
      count: 2,
    });

    const interval = ($env.MODE == 'prod') ? (90 * 1000) : (10 * 1000);

    // debug
    if (initialTweets.length) {
      $logger.info('Initial replies', screenName, initialTweets);
      await $slackService.message({
        channel: 'logging',
        username: 'debug',
        text: `screenName: ${screenName}, mention tweets: ${JSON.stringify(initialTweets)}`,
      });
    }

    // debug
    if (!initialTweets.length) {
      $logger.info('No initial replies', screenName, initialTweets);
      await $slackService.message({
        channel: 'logging',
        username: 'debug',
        text: `screenName: ${screenName}, mention initialTweets: ${JSON.stringify(initialTweets)}`,
      });
    }

    let sinceId = initialTweets.length ? initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str : undefined;
    let total = 0;
    let lastTweet;
    let time;

    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getSearch({
        q: `to:${screenName}`,
        recent: true,
        since_id: sinceId,
      });

      
      const now = Date.now();

      if (newTweets.length) {

        const tweets = [];

        for (let i = 0; i < newTweets.length; i++) {
          let tweet = newTweets[i];
          if (
            (sinceId != null || (now - new Date(tweet.created_at) < interval * 5)) &&
            ((tweet.user.statuses_count - i) % modulus === 0)
          ) {
            tweets.push(tweet);
          }
        }

        if (tweets.length) {
          await $slackService.publish(tweets, `(Mention: ${screenName})`);
          lastTweet = tweets.slice().pop();
          time = Date.now();
          total += tweets.length;
        }

        sinceId = newTweets[0].id_str;

      }

    }, interval);

    const status = () => {

      return {
        type: 'Mentions',
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


    let {name, protected: protectedUser} = (await $twitterService.getUser({
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
        channel: 'logging',
        username: 'debug',
        text: `screenName: ${screenName}, initialTweets: ${JSON.stringify(initialTweets)}`,
      });
    }

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

          if (!published[tweet.id_str] && !selfRetweet && age < MAX_AGE * 5) {

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
                if (
                  !(tweet.user.screen_name == 'JacobWohlReport' && /wohl/i.test(matchKey)) &&
                  !(tweet.user.screen_name == 'MollyJongFast' && /oy vey/i.test(matchKey)) &&
                  !(tweet.user.screen_name == 'AndrewYang' && /yang/i.test(matchKey))
                ) {
                  matchesMap[matchKey] = (~~matchesMap[matchKey]) + 1;
                }
              }

              for (const mention of item.entities.user_mentions) {
                
                if (
                  MENTIONS_MATCHES.some((screenName) => mention.screen_name.toLowerCase() == screenName.toLowerCase()) &&
                  mention.screen_name != tweet.user.screen_name &&
                  !(retweet && mention.screen_name == retweet.user.screen_name)
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

            if (
              (!greenwald) &&
              (score >= MIN_SCORE || matches.length)
             ) {

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

            if (!published[tweet.id_str] && age < MAX_AGE * 5) {

              const score = retweet ? 0 : getScore(tweet, levels[1], protectedUser);
              const matchesMap = {};

              for (const item of [retweet || tweet, quotedTweet]) {

                if (!item) {
                  continue;
                }

                let match;

                // if (CAPS_REG_EXP.test(filterTweetText(item))) {
                //   matchesMap['<ALL CAPS>'] = (~~matchesMap['<ALL CAPS>']) + 1;
                // }

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
                  'secondary'
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
