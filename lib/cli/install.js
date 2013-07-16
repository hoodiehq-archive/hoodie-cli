var hoodie = require('../main');

//
// $ hoodie install <module>
//
// Install hoodie module
//
// Options:
//
//  - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `e` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  'use strict';

  this.logo();

  // display help on $ hoodie install
  if (argv._.length <= 1) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  var data = {
    plugin: argv._[1] || argv.plugin || argv.p
  };

  // install new module
  hoodie.install(data, function(err) {
    callback(err);
  });

};
