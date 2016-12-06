/** Slack Twitter */

/* jshint esversion: 6 */

'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const request = require('request');
const winston = require('winston');
const Twitter = require('twitter-node-client').Twitter;

const TWITTER_API_CONFIG = {
  consumerKey: 'yd7ha7ycBmRDfTk9YclkrGlBS',
  consumerSecret: 'Cb032Xda44aM3HzCBRt3z9GwiYmpvp2VuSoI4UQNnr6r58JTbN',
  accessToken: '21429174-p3Oo40457k52Rl3fBgvinDNUAx7cyAibLRyNF5FQ5',
  accessTokenSecret: 'y09OTks43F9ej01vTDAGkjnLk1Z16asRRMFP4vF94j3t9',
  callBackUrl: 'http://www.google.com'
};

const LOG_PATH = 'tmp/app.log';
const SLACK_ENDPOINT = 'https://hooks.slack.com/services/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';
const POLL_INTERVAL = 30 * 1000;

function createLogger() {
  return new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'info' }),
      new (winston.transports.File)({ filename: LOG_PATH, level: 'warn' })
    ]
  });
}

function createTwitter() {

  let twitter = new Twitter(TWITTER_API_CONFIG);
  
  twitter.getUserTimeline = ((fn) => {
    
    return function getUserTimeline(params) {
      
      return new Promise((resolve, reject) => {
        fn(
          params,
          function error(error, request, body) {
            reject(error, request, body);
          },
          function success(data) {
            resolve(JSON.parse(data));
          }
        );
      });

    };

  })(twitter.getUserTimeline.bind(twitter));

  return twitter;

}

function main() {
  
  let logger = createLogger();
  let twitter = createTwitter();

  Promise.try(() => {

    return twitter.getUserTimeline({
      screen_name: 'realDonaldTrump',
      count: 1 
    });

  }).then((data) => {

    logger.info('initial request:', data);
    return poll(data[0].id, twitter, logger);

  }).catch((err) => {

    logger.error(err, Array.from(arguments).slice(1));

  });

}

function poll(sinceId, twitter, logger) {

  return Promise.try(() => {

    return twitter.getUserTimeline({
      screen_name: 'realDonaldTrump',
      since_id: sinceId
    });

  }).then((data) => {

    logger.info('poll', data);

    if (data.length) {
      sinceId = data[0].id;
      publish(data, logger);
    }

    return new Promise((resolve, reject) => {
      setTimeout(resolve, POLL_INTERVAL);
    });
  
  }).then(() => {
    
    return poll(sinceId, twitter, logger);

  });

}

function publish(data, logger) {

  request.post({
    url: SLACK_ENDPOINT,
    body: JSON.stringify({
      //channel: '#lifeboat',
      username: 'twitter',
      text: data.slice().reverse().map((item) => {
        return 'https://twitter.com/realDonaldTrump/status/' + item.id;
      }).join(' '),
      icon_url: 'https://a.slack-edge.com/66f9/img/services/twitter_36.png'
      //icon_emoji: ''
    })
  },
  (err, response, body) => {
    if (err) {
      logger.error('slack error:', err);
    } else {
      logger.info('slack success:', body);
    }
  });

}

main();
