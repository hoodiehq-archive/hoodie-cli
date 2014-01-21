var hoodie = require('../main');

//
// $ hoodie install <plugins>
//
// Install hoodie plugins
//
// Options:
//
//  - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `e` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  this.logo();

  // display help on $ hoodie install
  if (argv._.length <= 0) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  var data = {
    plugins: argv._[1] || argv.plugins || argv.p,
    verbose: argv.verbose,
    link: argv.link
  };

  // install new plugin
  hoodie.install(data, function(err) {
    callback(err);
  });

};
