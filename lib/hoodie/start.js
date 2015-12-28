var Command = require('./util/command');
var util = require('util');
var fs = require('graceful-fs');
var async = require('async');
var fork = require('child_process').fork;
var path = require('path');

function CreateCommand() {
  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Start hoodie services.
//
// Options:
//   - `browser` {String} whether to open a browser window upon app start
//
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

  this.insight.track('hoodie', 'start');

  // optional callback
  callback = callback || function() {};

  this.execute(options, callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options, callback) {
  var self = this;
  var processArgs = [];

  // get project-specific startup settings from package.json
  //
  try {
    var project = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    var settings = project.hoodie.start;

    if (!settings) throw 'exception';
  }
  catch (e) {
    console.log('Hoodie couldn\'t find any local startup settings');
  }

  // adds ability to bypass sudo check
  //
  if (!options.sudo) {
    if (process.env.SUDO_USER) {
      this.hoodie.emit('warn', 'Hoodie does not support being run as sudo. Please try again.');
      return callback();
    }
  }

  async.detect([
    path.resolve('node_modules/hoodie-server/bin/start')
  ], fs.exists, function (startPath) {

    // bail if hoodie start not found
    if (!startPath) {
      self.hoodie.emit('warn', 'Could not start hoodie.');
      return callback(new Error('Could not find hoodie-server'));
    }

    // serve from custom location
    var www = options.www || settings['root-folder'];
    if (www) {
      processArgs.push('--www', www);
      self.hoodie.emit('info', 'Serving hoodie from ' + www);
    }

    // configure custom ports
    var ports = options['custom-ports'] || settings['custom-ports'];
    if (ports) {
      processArgs.push('--custom-ports', ports);
      self.hoodie.emit('info', 'Serving hoodie on custom ports ' + ports);
    }

    if (options.verbose || settings.verbose) {
      processArgs.push('-v');
    }

    if (options.force || !self.pid.exists()) {
      // forks hoodie app and listens for messages
      // coming through on the process
      var serverProcess = fork(startPath, processArgs);

      serverProcess.on('message', function (msg) {

        if (msg.app.started) {

          //write PID file
          try {
            self.pid.create(path.resolve('data/hoodie.pid'), options.force);
          } catch (err) {
            self.hoodie.emit('warn', err.message);
            process.exit(1);
            return callback(err);
          }

          // open hoodie app in browser
          var openBrowser = settings['open-browser'] || true;
          if (openBrowser && !options.noBrowser) {

            self.openBrowser(msg.stack.www, function (err) {

              if (err) {
                self.hoodie.emit('warn', err.message);
              }

              self.hoodie.emit('info', 'Hoodie app is running!');
              return callback();
            });
          }

        }

        return callback();

      });
    } else {
      self.hoodie.emit('warn', 'Hoodie is already running!');
    }


  });

  // remove PID if process is terminated.
  ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT', 'exit'].forEach(function (s) {
    process.on(s, self.pid.remove);
  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};
