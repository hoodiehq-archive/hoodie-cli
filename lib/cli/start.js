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

  this.logo();

  // display help on $ hoodie start
  if (argv._.length <= 0) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  // start args
  var data = {
    noBrowser: argv._[1] || argv.noBrowser || argv.n,
    www: argv._[2] || argv.www || argv.w
  };

  // start hoodie services
  hoodie.start(data, function(err) {
    callback(err);
  });

};
