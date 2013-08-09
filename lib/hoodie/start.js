var Command = require('./util/command');
var util = require('util');
var npm = require('npm');


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

  npm.load({}, function (err) {

    // error out if we encounter npm issues
    if (err) {
      self.hoodie.emit('error', 'Could not start Hoodie');
      process.exit(1);
      throw err;
    }

    // run npm start
    npm.commands.start(function (err) {

      // error out if we encounter npm issues
      if (err) {
        process.exit(1);
        throw err;
      }

      // open hoodie app in browser
      if (!options.noBrowser) {

        self.openBrowser(function (err) {

          if (err) {
            self.hoodie.emit('warn', err.message);
            process.exit(1);
          }

          self.hoodie.emit('info', 'Hoodie app is running!');
          return callback();

        });
      }

    });

  });

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};
