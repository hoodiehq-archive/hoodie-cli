var hoodie = require('../main');

//
// $ hoodie cache
//
// Clean hoodie-cli cache
//
// Options:
//
//  - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `e` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  // display help on $ hoodie cache
  if (argv._.length <= 1) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  var data = {
    clean: argv.clean || argv.c,
    list: argv.list || argv.l
  };

  // clean cache
  hoodie.cache(data, function(err) {
    callback(err);
  });

};
