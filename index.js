'use strict';

const puppeteer = require('puppeteer');
const setup = require('./modules/setup');
const twitter = require('./modules/twitter');

const config = require('./config.json');

async function execute() {

  /*
    create the only browser instance and get the first page
  */
  const width = 1000
  const height = 800

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--window-size=${width},${height}`
    ],
  });

  const pages = await browser.pages();

  await pages[0].setViewport({
    width,
    height
  });

  await setup.init(pages[0], browser, config);

  await twitter.operate(pages[0], browser, config);

  // if (config.task == 'accountcheck') {
  //
  //   await setup.checkaccount(pages[0], browser, config);
  //
  // } else if (config.task == 'getfuntweets') {
  //
  //   await setup.getfuntweets(pages[0], browser, config);
  //
  // } else if (config.task == 'earnpoints') {
  //
  //   if (!config['twitter_users'].twitter_preparation_done) {
  //     // tweeting and deleting followers
  //     await setup.prepare(pages[0], browser, config);
  //
  //   } else {
  //     // earn points - following, liking, and retweeting
  //     await setup.init(pages[0], browser, config);
  //
  //     if (!config['twitter_users'].twitter_operation_done) {
  //       await twitter.operate(pages[0], browser, config);
  //     }
  //
  //     // await setup.reset(pages[0], browser, config);
  //
  //   }
  //
  // }


};

execute();
