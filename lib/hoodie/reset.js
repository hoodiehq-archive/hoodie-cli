var Command = require('./util/command');

var fs = require('fs');
var ini = require('ini');
var path = require('path');
var util = require('util');


function CreateCommand() {
  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Reset Config Param.
//
// Options:
//
//   - `options` {Object} is data required to create an app
//     - `plugin` {String}
//   - [`callback`] {Function} is triggered after creating the app.
//     - `e` {Error} is null unless there is an error.
//
// Returns:
//
//   {hoodie} for chaining.
///

CreateCommand.prototype.run = function(options, callback) {

  // require options
  if (!options) {
    this.hoodie.emit('warn', 'requires options parameter:');
    return;
  }

  // optional callback
  callback = callback || function() {};

  this.insight.track('hoodie', 'reset');

  this.reset(callback);

  return this.hoodie;
};

//
// Reset Password.
//

CreateCommand.prototype.reset = function (cb) {

  var self = this;
  var couchIniPath = path.join(process.cwd(), 'data/couch.ini');
  var config = ini.parse(fs.readFileSync(couchIniPath, 'utf-8'));

  delete config.admins;

  fs.writeFile(couchIniPath, ini.stringify(config), function (err) {
    if (err) {
      self.hoodie.emit('warn', 'oops, something went wrong');
      cb(err);
      return;
    }

    self.hoodie.emit(
      'info', 'password reset sucessfully. Please run \'hoodie start\''
    );
    cb(null);
  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

