'use strict';

const fs = require('fs');
const http = require('http');
const inject = require('./inject');
const moment = require('moment');
const path = require('path');

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
    result += `
<div class="task">
  ${taskTemplates[task.type](task)}
</div>
`;
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

  AllTweets: ({ screenName, name, total, lastTweets, time }) => {
    
    const tweet = lastTweets && lastTweets[lastTweets.length - 1];

    return `
<div class="all-tweets-task">
  <p><strong>All Tweets from ${name ? `${name} (@${screenName})` : `@${screenName}`}</strong></p>
  <p>Total tweets: ${total}</p>
  <p>Last tweet: ${renderTweetLink(tweet)} ${renderTweetTime(time)}</p>
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

  HighScoringTweets: ({ screenName, name, total, lastTweets, time }) => {

    const tweet = lastTweets && lastTweets[lastTweets.length - 1];

    return `
<div class="high-scoring-tweets-task">
  <p><strong>High Scoring Tweets from ${name ? `${name} (@${screenName})` : `@${screenName}`}</strong></p>
  <p>Total tweets: ${total}</p>
  <p>Last tweet: ${renderTweetLink(tweet)} ${renderTweetTime(time)}</p>
</div>`;
  }

};

function getServer([$env, $slackService, $taskService, $twitterService]) {

  return http.createServer(async (req, res) => {

    try {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const match = /^\/tweet\/(\d+)/i.exec(req.url);

      if (match) {

        const result = await $twitterService.getTweet({ id: match[1] });
        res.end(renderTest(result));

      } else {

        const filename = path.join($env.HOME, 'screenNames');
        const separator = ',';
        const tasks = $taskService.status();

        if (fs.existsSync(filename)) {

          const oldScreenNameMap = Object.fromEntries(
            fs.readFileSync(filename, 'utf8').split(separator).map(item => [item, true])
          );

          const newScreenNameMap = Object.fromEntries(
            tasks.map(item => [item.screenName, true])
          );

          const added = [];
          const removed = [];

          for (let newScreenName of Object.keys(newScreenNameMap)) {

            if (oldScreenNameMap[newScreenName]) {
              delete oldScreenNameMap[newScreenName];
            } else {
              added.push(newScreenName);
            }

          }

          for (let oldScreenName of Object.keys(oldScreenNameMap)) {
            removed.push(oldScreenName);
          }

          if (added.length) {
            $slackService.message(`_Added ${added.sort(', ')}_`);
          }

          if (removed.length) {
            $slackService.message(`_Removed ${removed.sort().join(', ')}_`)
          }

        }

        fs.writeFileSync(filename, tasks.map(item => item.screenName).join(separator));
        res.end(render(tasks));
      }

    } catch (e) {

      await $slackService.crashReport(e.stack);
      throw(e);

    }

  });

}

module.exports = inject(getServer);
