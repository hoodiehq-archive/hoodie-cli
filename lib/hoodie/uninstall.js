var Command = require('./util/command');
var which = require('which').sync;
var util = require('util');


function CreateCommand() {
  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Uninstalls plugin
//
// Uninstalls a hoodie plugin
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
  if (!options) { throw new Error('requires option parameter'); }
  if (!options.plugin) { throw new Error('requires option.plugin parameter'); }

  // optional callback
  callback = callback || function() {};

  // validate options
  options.plugin = options.plugin || null;

  // uninstall plugin
  this.execute(options, callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options, callback) {

  var self = this;
  var npmArgs = ['remove', options.plugin, '--save'];

  self.exec(which('npm'), npmArgs, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Error uninstalling plugin:');
      callback(err);
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('info', 'Successfully uninstalled ', options.plugin);

  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

