var cp = require('child_process');
var path = require('path');
var openBrowser = require('open');

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

  this.hoodie = hoodie;

  var self = this;
  return function() {
    return self.run.apply(self, arguments);
  };
}

Command.prototype.pid = pid;

//
// Exec!
//
Command.prototype.exec = function (cmd, args, callback) {

  var child = cp.spawn(cmd, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });

  child.on('data', function(data) {
    return callback(null, data);
  });

  child.on('error', function (err) {
    return callback(err, null);
  });

  child.on('exit', function (code) {
    return callback(code, null);
  });

};

//
// Open app in browser
//
Command.prototype.openBrowser = function (www, callback) {

  var url = 'http://' + www.host + ':' + www.port;
  openBrowser(url, callback);

};

Command.prototype.getCacheDir = function () {
  var homedir = 'HOME';

  if (process.platform === 'win32') {
    homedir = 'USERPROFILE';
  }

  return path.join(process.env[homedir], '.hoodie/cache/');
};


module.exports = Command;
