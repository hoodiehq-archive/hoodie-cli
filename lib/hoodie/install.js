var Command = require('./util/command');
var packages = require('./util/packages');
var which = require('which').sync;
var util = require('util');
var async = require('async');


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
  if (!options) {
    this.hoodie.emit('warn', 'requires options parameter:');
    return;
  }

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

  if (options.link) {

    self.exec(which('npm'), ['link'], function (err) {

      if (err) {
        self.hoodie.emit('warn', 'Error installing: ');
        process.exit(1);
        throw err;
      }
      self.hoodie.emit('info', 'Successfully linked modules');
    });

  } else {

    if (!options.plugins) {
      this.hoodie.emit('warn', 'requires options.plugins parameter:');
      return;
    }

    // TODO: the below needs a refactor
    // probably worth breaking up the logic into smaller more
    // reusable pieces

    var pluginsArr = options.plugins.split(',');

    async.map(pluginsArr, function (p, cb) {
      var plugin = p.trim();
      var npmArgs = ['install', '--save', 'hoodie-plugin-' + plugin];

      if (options.verbose) {
        npmArgs.push('--verbose');
      }

      self.exec(which('npm'), npmArgs, function (err) {

        if (err) {
          self.hoodie.emit('warn', 'Error installing plugin: ' + plugin);
          process.exit(1);
          throw err;
        }
        self.hoodie.emit('info', 'Successfully installed ' + plugin + ' plugin');
        return cb(null, p);
      });
    },
    function (err, plugins) {
      var modules = plugins.map(function (name) {
        return 'hoodie-plugin-' + name;
      });
      packages.extendPlugins('package.json', modules, function (err) {
        if (err) {
          self.hoodie.emit('warn', 'Error updating package.json');
          process.exit(1);
          throw err;
        }
        self.hoodie.emit('info', 'Successfully updated package.json');
      });
    });
  }

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

