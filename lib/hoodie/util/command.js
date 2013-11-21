var cp = require('child_process');
var fs = require('graceful-fs');
var path = require('path');
var openBrowser = require('open');

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
Command.prototype.openBrowser = function (callback) {

  var file = process.cwd() + '/data/stack.json';
  var errMsg = 'Hoodie could not read stack.json. Please try again.';

  fs.readFile(file, function(err, config) {
    var cfg = JSON.parse(config.toString());

    if (err) {
      callback(new Error(errMsg));
    } else {
      var url = 'http://' + cfg.www.host + ':' + cfg.www.port;
      openBrowser(url, callback);
    }
  });

};

Command.prototype.getCacheDir = function () {
  var homedir = 'HOME';

  if (process.platform === 'win32') {
    homedir = 'USERPROFILE';
  }

  return path.join(process.env[homedir], '.hoodie/cache/');
};


module.exports = Command;
