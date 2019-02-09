'use strict';

const fs = require('fs');
const http = require('http');
const inject = require('./inject');
const moment = require('moment');
const path = require('path');
//const { Client: PGClient } = require('pg');

function render(tasks) {

  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Slack Twitter Monitor</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.css">
    <style>
    </style>
  </head>
  <body>
    ${renderTasks(tasks)}
  </body>
</html>`;

}

function renderTest(tweet) {
  
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Slack Twitter Monitor</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.css">
    <style>
      pre {
        font-family: monospace;
      }
    </style>
  </head>
  <body>
    <pre>${JSON.stringify(tweet, null, 4)}</pre>
  </body>
</html>`;

}

function renderTasks(tasks) {

  var result = '<div class="tasks">';

  for (let task of tasks) {
    if (taskTemplates[task.type]) {
      result += `
<div class="task">
  ${taskTemplates[task.type](task)}
</div>
`;
    }
  }

  result += '</div>';

  return result;

}

function renderTweetLink(tweet) {
  if (!tweet) {
    return '&lt;none&gt;';
  }
  /* jshint camelcase: false */
  const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
  return `<a href="${url}" target="_blank">${url}</a>`;
}

function renderTweetTime(time) {
  return time ? `(${moment(time).fromNow()})` : '';
}

const taskTemplates = {

  AllTweets: ({ screenName, name, total, lastTweet, time }) => {

    return `
<div class="all-tweets-task">
  <p><strong>All Tweets from ${name ? `${name} (@${screenName})` : `@${screenName}`}</strong></p>
  <p>Total tweets: ${total}</p>
  <p>Last tweet: ${renderTweetLink(lastTweet)} ${renderTweetTime(time)}</p>
</div>`;
  },

//   BestTweets: ({ total, lastTweet, time }) => {

//     /* jshint camelcase: false */
//     return `
// <div class="best-tweets-task">
//   <p><strong>Best Tweets</strong></p>
//   <p>Total tweets: ${total}</p>
//   <p>Last tweet: ${renderTweetLink(lastTweet)} ${renderTweetTime(time)}</p>
// </div>`;
//   },

  HighScoringTweets: ({ screenName, name, total, lastTweet, time }) => {

    return `
<div class="high-scoring-tweets-task">
  <p><strong>High Scoring Tweets from ${name ? `${name} (@${screenName})` : `@${screenName}`}</strong></p>
  <p>Total tweets: ${total}</p>
  <p>Last tweet: ${renderTweetLink(lastTweet)} ${renderTweetTime(time)}</p>
</div>`;
  }

};

function getServer([$env, $logger, $slackService, $taskService, $twitterService]) {

  return http.createServer(async (req, res) => {

    try {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const match = /^\/tweet\/(\d+)/i.exec(req.url);

      if (match) {

        const result = await $twitterService.getTweet({ id: match[1], protected: true });
        res.end(renderTest(result), 'utf-8');

      } else {

        const filename = path.join($env.HOME, 'screenNames');
        const separator = ',';

        // const client = new Client({
        //   connectionString: $env.DATABASE_URL,
        //   ssl: true,
        // });

        // client.connect();

        // client.query();

        const tasks = $taskService.status();

        // if (fs.existsSync(filename)) {

        //   const oldScreenNameMap = {}
        //   for (const screenName of fs.readFileSync(filename, 'utf8').split(separator)) {
        //     if (screenName) {
        //       oldScreenNameMap[screenName] = true;
        //     }
        //   }

        //   const newScreenNameMap = {};
        //   for (const task of tasks) {
        //     newScreenNameMap[task.screenName] = true;
        //   }

        //   const added = [];
        //   const removed = [];

        //   for (const newScreenName of Object.keys(newScreenNameMap)) {

        //     if (oldScreenNameMap[newScreenName]) {
        //       delete oldScreenNameMap[newScreenName];
        //     } else {
        //       added.push(newScreenName);
        //     }

        //   }

        //   for (const oldScreenName of Object.keys(oldScreenNameMap)) {
        //     removed.push(oldScreenName);
        //   }

        //   if (added.length) {
        //     $slackService.message(`_Added ${added.sort(', ')}_`);
        //   }

        //   if (removed.length) {
        //     $slackService.message(`_Removed ${removed.sort().join(', ')}_`)
        //   }

        // }

        // $logger.info(`WRITING FILE ${filename}`);
        // fs.writeFileSync(filename, tasks.map(item => item.screenName).join(separator));
        res.end(render(tasks), 'utf-8');
      }

    } catch (e) {

      await $slackService.crashReport(e.stack);
      throw(e);

    }

  });

}

module.exports = inject(getServer);
