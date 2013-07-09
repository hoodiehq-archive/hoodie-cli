var hoodie = require('../main');

//
// $ hoodie start
//
// Starts hoodie services.
//
// Options:
//
//   - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `err` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  'use strict';

  // display help on $ hoodie start
  if (argv._.length <= 1) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  // start hoodie services
  hoodie.start(function(err) {
    callback(err);
  });

};
