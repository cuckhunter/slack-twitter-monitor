'use strict';

const http = require('http');

const PORT = process.env.PORT || 80;


class Server {

  constructor(logger, slackClient) {

    this._logger = logger;
    this._slackClient = slackClient;
    this._server = http.createServer(((req, res) => {

      const tweetUrls = this._slackClient.urls;
      let lastTweet = '&lt;none&gt;';

      if (tweetUrls.length) {
        const lastTweetUrl = tweetUrls[tweetUrls.length - 1];
        lastTweet = `<a href="${lastTweetUrl}">${lastTweetUrl}</a>`;
      }

      const data = `<!DOCTYPE html>
        <html>
          <head>
            <title>Slack Twitter Test</title>
          </head>
          <body>
            <p>Total tweets: ${tweetUrls.length}</p>
            <p>Last tweet: ${lastTweet}</p>
          </body>
        </html>`;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);

    }).bind(this));
  }

  start() {
    this._server.listen(PORT, (() => {
      this._logger.info(`Server running at http://localhost:${PORT}/`);
    }).bind(this));
  }

}

module.exports = function getServer(logger, slackClient) {
  return new Server(logger, slackClient);
};
