var Command = require('./util/command'),
    path = require('path'),
    util = require('util');


function CreateCommand(hoodie) {

  'use strict';

  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Create a New App.
//
// Creates an project on the local filesystem.
// This project is backwards compatible with Apache Cordova projects.
//
// Options:
//
//   - `options` {Object} is data required to create an app
//     - `path` {String} is a directory path for the app.
//     - `name` {String} is the application name (default: 'Hello World')
//     - `id` {String} is the package name (default: 'com.hoodie.hello-world')
//   - [`callback`] {Function} is triggered after creating the app.
//     - `e` {Error} is null unless there is an error.
//
// Returns:
//
//   {hoodie} for chaining.
///

CreateCommand.prototype.run = function(options, callback) {

  'use strict';

  // require options
  if (!options) { throw new Error('requires option parameter'); }
  if (!options.path) { throw new Error('requires option.path parameter'); }

  // optional callback
  callback = callback || function() {};

  // validate options
  options.path = path.resolve(options.path);
  options.name = options.name || 'Hello World';

  // create app
  this.execute(options, callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options, callback) {
};

module.exports = {
  create: function(hoodie) {

    'use strict';

    return new CreateCommand(hoodie);
  }
};

