var hoodie = require('../main');

//
// $ hoodie create <path>
//
// Create a hoodie project.
//
// Options:
//
//   - `argv` {Object} is an optimist object.
//   - `callback` {Function} is a completion callback.
//     - `err` {Error} is null unless there was an error.
//

module.exports = function(argv, callback) {

  this.logo();

  // display help on $ hoodie new
  if (argv._.length <= 0) {
    argv._.unshift('help');
    this.argv(argv, callback);
    return;
  }

  // project info
  var data = {
    name: argv._[1] || argv.name || argv.n,
    template: argv._[2] || argv.template || argv.t,
    plugins: argv._[3] || argv.plugins || argv.p,
    ssh: argv['use-ssh'] || argv.s,
    verbose: argv.verbose
  };

  // create the project
  hoodie.new(data, function(err) {
    callback(err);
  });

};
