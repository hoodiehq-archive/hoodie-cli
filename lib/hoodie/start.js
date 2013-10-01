var Command = require('./util/command');
var util = require('util');
var which = require('which').sync;
var fs = require('fs');
var async = require('async');
var fork = require('child_process').fork;

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
  var npmArgs = [];

  async.detect([
    // TODO: tidy up those paths once we're done with the npa refactor.
    process.cwd() + '/node_modules/hoodie-app/bin/start',
    process.cwd() + '/node_modules/hoodie-server/bin/start'
  ], fs.exists, function(startPath) {

    // bail if hoodie start not found
    //
    if (!startPath) {
      self.hoodie.emit('warn', 'Could not start hoodie.');
      return callback();
    }

    npmArgs.push(startPath);

    // serve from custom location
    //
    if (options.www) {
      npmArgs.push('--www', options.www);
      self.hoodie.emit('info', 'Serving hoodie from ' + options.www);
    }

    fork(npmArgs).on('message', function (msg) {

      if (msg.app.started) {

        // open hoodie app in browser
        //
        if (!options.noBrowser) {

          self.openBrowser(function (err) {

            if (err) {
              self.hoodie.emit('warn', err.message);
              process.exit(1);
              return callback(err);
            }

            self.hoodie.emit('info', 'Hoodie app is running!');
            return callback();
          });
        }

      }

      return callback();

    });

  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};
