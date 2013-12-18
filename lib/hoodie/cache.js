var Command = require('./util/command');
var util = require('util');
var fs = require('graceful-fs');
var rmrf = require('rimraf');


function CreateCommand() {
  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// List and clear cache
//
// Options:
//
//   - `options` {Object} is data required to create an app
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

  // install plugin
  this.execute(options, callback);

  return this.hoodie;
};

CreateCommand.prototype.list = function() {

  fs.readdir(this.getCacheDir(), function (err, files) {
    files.forEach(function(file) {
      if (!(/^\./).test(file)) {
        console.log(file);
      }
    });
  });

};

CreateCommand.prototype.clean = function() {

  var self = this;

  fs.readdir(this.getCacheDir(), function (err, files) {


    files.forEach(function(file) {

      if (!(/^\./).test(file)) {

        self.hoodie.emit('info', 'cleaning cache...');

        rmrf(self.getCacheDir() + file + '/', function(err) {

          if (err) {
            self.hoodie.emit('warn', 'something\'s gone wrong');
            process.exit(1);
            throw err;
          }
          self.hoodie.emit('info', 'done');
        });

      }

    });


  });

};

//
// Execute.
//
CreateCommand.prototype.execute = function(options) {

  var self = this;
  var cmd = {
    list: function() {
      self.list();
    },

    clean: function() {
      self.clean();
    }
  };

  cmd[options.arg]();

};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

