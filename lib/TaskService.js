/* jshint camelcase: false */

'use strict';

const inject = require('./inject');

function setPoll(fn, interval) {
  
  return async function poll() {
    
    await fn();

    await new Promise((resolve) => {
      setTimeout(resolve, interval);
    });

    return poll(fn, interval);

  };

}

class TaskService {

  constructor() {
    this._tasks = {};
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
    excludeReplies = false,
    modulus = 1,
  ) {


    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2
    });

    const interval = ($env.MODE == 'prod') ? (60 * 1000) : (10 * 1000);
    const name = initialTweets[0].user.name;
    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweets;
    let time;
    
    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getUserTimeline({
        screen_name: screenName,
        include_rts: true,
        since_id: sinceId,
        exclude_replies: excludeReplies,
      });

      if (newTweets.length) {

        const tweets = [];

        for (let i = 0; i < newTweets.length; i++) {
          let tweet = newTweets[i];
          if ((tweet.user.statuses_count - i) % modulus === 0) {
            tweets.push(tweet);
          }
        }

        if (tweets.length) {
          await $slackService.publish(tweets);
          lastTweets = tweets;
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
        lastTweets,
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
  async runHighScoringTweetsTask([$env, $slackService, $twitterService], screenName) {

    const MAX_DELAY = 5 * 60 * 1000;
    const MIN_SCORE = 0.0012;
    
    const getScore = function ({
      favorite_count: favoriteCount,
      retweet_count: retweetCount,
      user: { followers_count: followersCount }
    }) {
      return followersCount > 0 ? (favoriteCount + 3 * retweetCount) / followersCount : 0;
    }
    
    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2
    });

    const interval = ($env.MODE == 'prod') ? (90 * 1000) : (60 * 1000);
    const name = initialTweets[0].user.name;
    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweets;
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
        const tweets = [];
        const newPublished = {};

        for (let i = newTweets.length - 1; i >= 0; i--) {
          
          const tweet = newTweets[i];
          const retweet = tweet.retweeted_status;
          const age = now - new Date(tweet.created_at);
          
          if (age < MAX_DELAY) {

            const score = getScore(retweet || tweet);
            if (score >= MIN_SCORE) {
              if (!published[tweet.id_str] && !retweet) {
                tweets.unshift(tweet);
              }
              newPublished[tweet.id_str] = true;
            }

          } else {

            sinceId = tweet.id_str;

          }

        }

        published = newPublished;

        if (tweets.length) {
          await $slackService.publish(tweets);
          lastTweets = tweets;
          time = Date.now();
          total += tweets.length;
        }

      }

    }, interval);
    
    const status = () => {

      return {
        type: 'HighScoringTweets',
        screenName,
        name,
        total,
        lastTweets,
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
          (a.name != null) ? a.name.localeCompare(b.name) : 1;

      });
  }

  async _run([$logger], execute, status) {
    this._tasks[Date.now()] = { status };
    await execute();
  }

}

module.exports = function getTaskService() {
  return new TaskService();
};

inject(TaskService);
