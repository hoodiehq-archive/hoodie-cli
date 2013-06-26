var hoodie = require('../main');

//
// $ hoodie uninstall <module>
//
// Uninstall hoodie module
//
// Options:
//
//  - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `e` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  'use strict';

  // display help on $ hoodie uninstall
  if (argv._.length <= 1) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  var data = {
    module: argv._[1] || argv.module || argv.m
  };

  // uninstall new module
  hoodie.uninstall(data, function(err) {
    callback(err);
  });
};
