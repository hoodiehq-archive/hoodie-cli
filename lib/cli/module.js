/*!
 * Module dependencies.
 */

var hoodie = require('../main');

/**
 * $ hoodie module <path>
 *
 * Create a hoodie app.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {

  'use strict';

  // display help on $ hoodie create
  if (argv._.length <= 1) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  // project info
  var data = {
    path: argv._[1],
    id: argv._[2] || argv.id || argv.i,
    name: argv._[3] || argv.name || argv.n
  };

  // create the project
  hoodie.create(data, function(e) {
    callback(e);
  });
};
