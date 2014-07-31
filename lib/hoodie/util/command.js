var openBrowser = require('open');

var insightProvider = require('./insight');
var pid = require('./pid');

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

  var self = this;

  self.hoodie = hoodie;

  return function() {
    return self.run.apply(self, arguments);
  };
}

Command.prototype.insight = insightProvider();

Command.prototype.pid = pid;

//
// Open app in browser
//
Command.prototype.openBrowser = function (www, callback) {

  var url = 'http://' + www.host + ':' + www.port;
  openBrowser(url, callback);

};

module.exports = Command;

