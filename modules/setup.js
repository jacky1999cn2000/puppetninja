'use strict';

const like4like = require('../services/like4like');
const twitter = require('../services/twitter');
const funtweets = require('../services/funtweets');
const utils = require('../services/utils');
const manager = require('../services/manager');

module.exports = {

  prepare: async (page, browser, config) => {

    utils.log('setup:prepare');

    await twitter.prepare(page, browser, config);

    config['twitter_users'].twitter_preparation_done = true;
    manager.save(config);

    process.exit(0);
  },

  init: async (page, browser, config) => {

    utils.log('setup:init');

    let healthy = await twitter.login(page, browser, config);
    config = await manager.update(config, 'twitter', 'healthy', healthy);

    // if account is blocked, don't need to proceed
    if (healthy) {
      await like4like.login(page, browser, config);
    }

  },

  reset: async (page, browser, config) => {

    utils.log('setup:reset');

    let healthy = await manager.getvalue(config, 'twitter', 'healthy');

    // if account is blocked, don't need to do this
    if (healthy) {
      await youlikehits.removeTwitterUser(page, browser, config);
    }

    config = await manager.next(config);

    if (config.changeyoulikehitsuser) {
      config = await manager.changeyoulikehitsuser(config);
    }

    process.exit(0);
  },

  checkaccount: async (page, browser, config) => {

    utils.log('setup:checkaccount');

    let healthy = await twitter.login(page, browser, config);
    config = await manager.update(config, 'twitter', 'healthy', healthy);

    config = await manager.next(config);

    process.exit(0);

  },

  getfuntweets: async (page, browser, config) => {

    utils.log('setup:gettweets');

    await funtweets.get(page, browser, config);

    process.exit(0);
  },

}
