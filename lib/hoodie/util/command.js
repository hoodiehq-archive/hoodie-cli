var cp = require('child_process');
//
// Base Command.
//
// > All your base are belong to us.
//
// All commands should inherit from the base `Command` object.
//
// This object handles the dependency injection of the `hoodie` object.
//
// This has two major benefits:
//   1. Allows `hoodie` to create instances. This is helpful for testing.
//   2. Allows test framework to mock public interfaces during tests.
//
// Options:
//
//   - `hoodie` {Object} is the instance of `hoodie` for this command.
//
// Returns:
//
//   {Function} that will call the inheriting class' `run` function.
//

function Command(hoodie) {

  'use strict';

  this.hoodie = hoodie;

  var self = this;
  return function() {
    return self.run.apply(self, arguments);
  };
}

//
// Exec!
//
Command.prototype.exec = function (cmd, args, callback) {

  'use strict';

  var childProc = cp.spawn(cmd, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  childProc.on('exit', function() {
    callback(null);
  });

  childProc.on('error', function () {
    callback(true);
  });

};

module.exports = Command;
