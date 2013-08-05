var Command = require('./util/command'),
    which = require('which').sync,
    util = require('util');


function CreateCommand() {
  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Installs plugin.
//
// Installs a hoodie plugin
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

  // install plugin
  this.execute(options, callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options) {

  var self = this,
      uri = 'https://github.com/hoodiehq/worker-' + options.plugin + '.git',
      npmArgs = ['install', uri, '--save'];

  self.exec(which('npm'), npmArgs, function (err) {

    if (err) {
      self.hoodie.emit('warn', 'Error installing plugin:');
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('log', 'Successfully installed ', options.plugin);

  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

