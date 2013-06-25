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

Command.prototype.run = function(options, callback) {
  // subclasses should override this function
};

module.exports = Command;
