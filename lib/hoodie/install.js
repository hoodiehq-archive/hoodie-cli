var Command = require('./util/command');
var which = require('which').sync;
var util = require('util');


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
  if (!options.plugins) { throw new Error('requires option.plugins parameter'); }

  // optional callback
  callback = callback || function() {};

  // install plugin
  this.execute(options, callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options) {

  var self = this;

  options.plugins.split(',').forEach(function (p) {
    var plugin = p.trim();
    var uri = 'git://github.com/hoodiehq/worker-' + plugin + '.git';
    var npmArgs = ['install', '--save', uri];

    self.exec(which('npm'), npmArgs, function (err) {

      if (err) {
        self.hoodie.emit('warn', 'Error installing plugin: ' + plugin);
        process.exit(1);
        throw err;
      }

      self.hoodie.emit('info', 'Successfully installed ' + plugin + ' worker');

    });

  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

