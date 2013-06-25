var console = require('./util/console'),
    util = require('util');

//
// $ hoodie noop
//
// Outputs that the command-line command is unsupported.
//
// Options:
//
//   - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//

module.exports = function(argv, callback) {

  'use strict';

  console.error(util.format(
      "'%s' is not a %s command. See '%s help'",
      argv._[0],
      argv.$0,
      argv.$0
  ));

  callback();
};
