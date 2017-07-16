/* jshint camelcase: false */

'use strict';

const inject = require('./inject');

function setPoll(fn, interval) {
  
  return async function poll() {
    
    await fn();

    await new Promise((resolve, reject) => {
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
   */
  async runAllTweetsTask([$env, $slackService, $twitterService], screenName, interval, modulus = 1) {

    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2
    });

    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let total = 0;
    let lastTweets;
    let time;
    
    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getUserTimeline({
        screen_name: screenName,
        include_rts: true,
        since_id: sinceId
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
        total: total,
        lastTweets: lastTweets,
        time: time
      };

    };

    await this._run(execute, status);
    
  }

  /**
   * Best tweets from user's home timeline
   * 
   * @param  {String} screenName
   */
  async runBestTweetsTask([$env, $slackService, $twitterService], screenName, interval) {

    const initialTweets = await $twitterService.getHomeTimeline({
      include_rts: true,
      count: 2
    });

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
        total: total,
        lastTweet: lastTweet,
        time: time
      };

    }

    await this._run(execute, status);

  }

  status() {
    return Object.keys(this._tasks).map((id) => this._tasks[id].status());
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
