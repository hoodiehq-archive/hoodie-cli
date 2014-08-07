var Command = require('./util/command');
var packages = require('./util/packages');

var util = require('util');
var async = require('async');
var npm = require('npm');

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
  if (!options) {
    this.hoodie.emit('warn', 'requires options parameter:');
    return;
  }

  if (!options.plugins) {
    this.hoodie.emit('warn', 'requires options.plugins parameter:');
    return;
  }

  options.npmArgs = {
    loglevel: 'silent'
  };

  if (options.verbose) {
    options.npmArgs.loglevel = 'verbose';
  }

  // optional callback
  callback = callback || function() {};

  // uninstall plugin
  this.execute(options, callback);

  this.insight.track('hoodie', 'uninstall');

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options, callback) {

  var self = this;
  var pluginsArr = options.plugins.split(',');

  self.hoodie.emit('info', 'Removing plugin(s): ' + pluginsArr);

  npm.load(options.npmArgs, function(err, npm) {
    if (err) {
      self.hoodie.emit('warn', 'Error loading npm:');
      self.hoodie.emit('warn', err.message);
      throw err;
    }
    npm.config.set('save', true);

    async.map(pluginsArr, function (plugin, cb) {

      var fullName = 'hoodie-plugin-' + plugin;

      npm.remove(fullName, function(err) {
        if (err) {
          self.hoodie.emit('warn', 'Error uninstalling plugin: ' + plugin);
          self.hoodie.emit('warn', err.message);
          callback(err);
          process.exit(1);
          throw err;
        }

        self.hoodie.emit('info', 'Successfully uninstalled ' + plugin + ' plugin');
        cb(null, plugin);
      });
    },
    function (err, plugins) {
      var modules = plugins.map(function (name) {
        return 'hoodie-plugin-' + name;
      });
      packages.removePlugins('package.json', modules, function (err) {
        if (err) {
          self.hoodie.emit('warn', 'Error updating package.json');
          process.exit(1);
          throw err;
        }
        self.hoodie.emit('info', 'Successfully updated package.json');
      });
    });

  });
};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

