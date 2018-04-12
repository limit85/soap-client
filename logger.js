'use strict';

var _ = require('lodash');

var config = require('./config');

console.debug = function() {
  console.log.apply(null, arguments);
};

function setLogger(name) {
  if ('test' !== process.env.NODE_ENV) {
    require('console-stamp')(console, {
      metadata: _.padEnd('[' + name + ']', 11, ' '),
      include: ['debug', 'info', 'warn', 'error'],
      extend: {
        debug: 5
      },
      level: _.get(config, 'logLevel', 'log').toLowerCase(),
      formatter: function() {
        return new Date().toISOString();
      }
    });
  }
}

module.exports = {
  setLogger
};
