'use strict';

const _ = require('lodash');
const utils = require('./utils');

module.exports = {

  login: async (page, browser, config) => {

    utils.log('like4like:login', 2);

    await page.goto(config.like4like_url, {
      waituntil: "networkidle0"
    });
    await page.waitFor(2000);
    try {
      await page.type('#username', config.like4like_username, {
        delay: 20
      });
      await page.type('#password', config.like4like_password, {
        delay: 20
      });
      await page.click('#login > fieldset > table > tbody > tr:nth-child(8) > td > a');
      await page.waitFor(4000);
    } catch (e) {
      // console.log(e.name);
      // console.log(e.message);
      process.exit(1);
    }
  }

}
