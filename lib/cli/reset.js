var hoodie = require('../main');

//
// $ hoodie reset <thing>
//
// Resets given config param.
//
// Options:
//
//   - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `err` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  this.logo();

  // display help on $ hoodie reset
  if (argv._.length <= 1) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  // project info
  var data = {
    password: argv._[2] || argv.password || argv.p
  };

  // create the project
  hoodie.reset(data, function(err) {
    callback(err);
  });

};
