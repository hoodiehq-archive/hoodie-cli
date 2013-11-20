var Command = require('./util/command');
var util = require('util');
var fs = require('fs');


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

  this.reset(callback);

  return this.hoodie;
};

//
// Reset Password.
//

CreateCommand.prototype.reset = function (cb) {

  var processed;
  var self = this;
  var couchIniPath = process.cwd() + '/data/couch.ini';
  var couchIniString = fs.readFileSync(couchIniPath).toString();

  processed = couchIniString.replace(/(\[admins)[\s\S]+/, "");

  fs.writeFile(couchIniPath, processed, function (err) {
    if (err) {
      self.hoodie.emit('warn', 'oups, something went wrong');
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

