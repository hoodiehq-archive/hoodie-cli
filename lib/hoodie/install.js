var Command = require('./util/command');
var packages = require('./util/packages');
var npmUtils = require('./util/npm');

var util = require('util');
var async = require('async');
var shell = require('shelljs');


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

  options.npmLinkArgs = [
    'link'
  ];

  options.npmInstallArgs = [
    'install',
    '--save'
  ];

  options.execArgs = {
    async: true,
    silent: true
  };

  if (options.verbose) {
    options.execArgs.silent = false;
    options.npmLinkArgs.push('--loglevel', 'silly');
    options.npmInstallArgs.push('--loglevel', 'silly');
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

    shell.exec(npmUtils.bin() + ' ' + options.npmArgs.join(' '), options.execArgs, function(err) {

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

    self.hoodie.emit('info', 'Installing plugin(s): ' + pluginsArr.join(' '));

    async.map(pluginsArr, function (p, cb) {

      var pluginName = p.trim();

      if (pluginName.match('hoodie-plugin-')) {
        pluginName = pluginName.replace('hoodie-plugin-', '');
      }

      options.npmInstallArgs.push('hoodie-plugin-' + pluginName);

      shell.exec(npmUtils.bin() + ' ' + options.npmInstallArgs.join(' '), options.execArgs, function(err) {

        if (err) {
          self.hoodie.emit('warn', 'Error installing plugin: ' + pluginName);
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
  }

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

