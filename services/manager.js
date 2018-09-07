'use strict';

const _ = require('lodash');
const utils = require('./utils');
const jsonfile = require('jsonfile');

module.exports = {

  save: (config) => {

    utils.log('manager:save', 2);

    jsonfile.writeFileSync('./config.json', config);

    return config;
  },

  next: (config) => {

    utils.log('manager:next', 2);

    console.log('whichtwitteruser ', config['twitter_users'].whichtwitteruser);

    // reset twitter_operation_done and twitter_preparation_done
    config['twitter_users'].twitter_operation_done = false;
    config['twitter_users'].twitter_preparation_done = false;

    config['twitter_users'].whichtwitteruser = config['twitter_users'].whichtwitteruser + 1 > config['twitter_users'].twitter_user_max ? 1 : config['twitter_users'].whichtwitteruser + 1;

    jsonfile.writeFileSync('./config.json', config);

    return config;
  },

  update: (config, type, subtype, value) => {

    utils.log('manager:update', 2);

    config['twitter_users'][type + '_' + subtype + config['twitter_users'].whichtwitteruser] = value;

    jsonfile.writeFileSync('./config.json', config);

    return config;

  },

  getvalue: (config, type, subtype) => {

    utils.log('manager:getvalue', 2);

    return config['twitter_users'][type + '_' + subtype + config['twitter_users'].whichtwitteruser];

  }

}
