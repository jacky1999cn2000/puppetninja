'use strict';

const like4likeTwitter = require('../services/like4likeTwitter');
const utils = require('../services/utils');
const manager = require('../services/manager');

module.exports = {

  operate: async (page, browser, config) => {

    utils.log('twitter:operate');

    let healthy = await manager.getvalue(config, 'twitter', 'healthy');

    if (!healthy) {
      return;
    }

    // earn points
    // await like4likeTwitter.follow(page, browser, config);
    await like4likeTwitter.like(page, browser, config);
    // await youlikehitsTwitter.retweet(page, browser, config);
    //
    // config['youlikehits_user' + config.whichyoulikehitsuser].twitter_operation_done = true;
    // manager.save(config);

  }

}
