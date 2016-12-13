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
  async runAllTweetsTask([$env, $slackService, $twitterService], screenName, interval) {

    const initialTweets = await $twitterService.getUserTimeline({
      screen_name: screenName,
      include_rts: true,
      count: 2
    });

    let sinceId = initialTweets[$env.MODE == 'prod' ? 0 : 1].id_str;
    let lastTweets = null;
    let total = 0;
    
    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getUserTimeline({
        screen_name: screenName,
        include_rts: true,
        since_id: sinceId
      });

      if (newTweets.length) {

        await $slackService.publish(newTweets);

        sinceId = newTweets[0].id_str;
        lastTweets = newTweets;
        total += newTweets.length;

      }

    }, interval);
    
    const status = () => {

      return {
        type: 'AllTweets',
        total: total,
        lastTweets: lastTweets,
        time: lastTweets && Date.now()
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
    let lastTweet = null;
    let total = 0;

    const execute = setPoll(async () => {

      const newTweets = await $twitterService.getHomeTimeline({
        include_rts: true,
        since_id: sinceId
      });

      if (newTweets.length) {

        await $slackService.publish([newTweets[0]]);
       
        sinceId = newTweets[0].id_str;
        lastTweet = newTweets[0];
        total++;

      }

    }, interval);

    const status = () => {
      
      return {
        type: 'BestTweets',
        total: total,
        lastTweet: lastTweet,
        time: lastTweet && Date.now()
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
