//
// Parse command-line arguments.
//
// Inspects the arguments and calls the appropriate action.
//
// Options:
//
//   - `argv` {Object} is an optimist.argv object.
//   - `[callback]` {Function} is called on completion.
//

module.exports = function(argv, callback) {

  // optional callback
  callback = callback || function() {};

  // --help
  // --help <command>
  if (argv.help || argv.h) {
    argv._.unshift('help');
  }

  // no command displays help
  if (!argv._.length) {
    argv._.unshift('help');
  }

  // lookup command to execute
  var command = this;
  for (var i = 0, l = argv._.length; i < l; i++) {
    if (typeof command[argv._[i]] === 'function') {
      command = command[argv._[i]];
    }
    else {
      break;
    }
  }

  // execute command
  if (command === this) {
    this.unknown(argv, callback);
  }
  else {
    command.call(this, argv, callback);
  }

};
