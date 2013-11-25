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


//
// Execute.
//
CreateCommand.prototype.execute = function(options) {

  var self = this;

  console.log(self, options);


};

module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

