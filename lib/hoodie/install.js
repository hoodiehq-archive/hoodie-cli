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

  options.npmArgs = {
    loglevel: 'silent'
  };

  if (options.verbose) {
    options.npmArgs.loglevel = 'verbose';
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

CreateCommand.prototype.execute = function(options, callback) {

  var self = this;

  if (options.link) {
    npm.load(options.npmArgs, function(err, npm) {
      if (err) {
        self.hoodie.emit('warn', 'Error loading npm:');
        self.hoodie.emit('warn', err.message);
        process.exit(1);
        throw err;
      }

      npm.link(function(err) {
        if (err) {
          self.hoodie.emit('warn', 'Error installing: ');
          self.hoodie.emit('warn', err.message);
          process.exit(1);
          throw err;
        }

        self.hoodie.emit('info', 'Successfully linked modules');
      });

    });
    return;
  }

  if (!options.plugins) {
    var err = 'requires plugins parameter:';
    this.hoodie.emit('warn', err);
    callback(err);
    return;
  }

  // TODO: the below needs a refactor
  // probably worth breaking up the logic into smaller more
  // reusable pieces

  var pluginsArr = options.plugins.split(',');

  self.hoodie.emit('info', 'Installing plugin(s): ' + pluginsArr.join(' '));

  npm.load(options.npmArgs, function(err, npm) {
    if (err) {
      self.hoodie.emit('warn', 'Error loading npm:');
      self.hoodie.emit('warn', err.message);
      throw err;
    }
    npm.config.set('save', true);

    async.map(pluginsArr, function (p, cb) {

      var pluginName = p.trim();

      if (pluginName.match('hoodie-plugin-')) {
        pluginName = pluginName.replace('hoodie-plugin-', '');
      }

      var fullName = 'hoodie-plugin-' + pluginName;

      npm.install(fullName, function(err) {
        if (err) {
          self.hoodie.emit('warn', 'Error installing plugin: ' + pluginName);
          self.hoodie.emit('warn', err.message);
          process.exit(1);
          throw err;
        }

        self.hoodie.emit('info', 'Successfully installed ' + pluginName + ' plugin');
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

  });
};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

