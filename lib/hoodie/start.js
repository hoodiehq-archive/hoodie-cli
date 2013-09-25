var Command = require('./util/command');
var util = require('util');
var which = require('which').sync;
var fs = require('fs');


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

  var hoodieAppStartPath = process.cwd() + '/node_modules/hoodie-app/bin/start';
  var hoodieServerStartPath = process.cwd() + '/node_modules/hoodie-server/bin/start';   

  // look for start in hoodie-app module
  fs.exists(hoodieAppStartPath, function(exists) {
    if (exists) {
      runNpm([hoodieAppStartPath]); 
    } else {
      // look for start in hoodie-server module
      fs.exists(hoodieServerStartPath, function(exists) {
        if (exists) {
          runNpm([hoodieServerStartPath]);
        } else {
          // bail, there is no hoodie app.
          //
          self.hoodie.emit('warn', 'Could not start hoodie.');
          return callback();   
        }
      });
    }   
  });

  function runNpm(npmArgs) {
    // serve from custom location
    //
    if (options.www) {
      npmArgs.push('--www', options.www);
      self.hoodie.emit('info', 'Serving hoodie from ' + options.www);
    }

    self.exec(which('node'), npmArgs, function (err) {

      if (err) {
        process.exit(1);
        return callback(err);
      }

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

    });
  }
};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};
