var hoodie = require('../main');

//
// $ hoodie uninstall <plugins>
//
// Uninstall hoodie plugins
//
// Options:
//
//  - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `e` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  this.logo();

  // display help on $ hoodie uninstall
  if (argv._.length <= 0) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  var data = {
    plugins: argv._[1] || argv.plugins || argv.p,
    verbose: argv.verbose
  };

  // uninstall plugin
  hoodie.uninstall(data, function(err) {
    callback(err);
  });
};
