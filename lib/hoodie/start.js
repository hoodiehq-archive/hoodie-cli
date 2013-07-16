var Command = require('./util/command'),
    which = require('which').sync,
    util = require('util');


function CreateCommand() {

  'use strict';

  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Start hoodie services.
//
// Options:
//
//   - [`callback`] {Function} is triggered after creating the app.
//     - `e` {Error} is null unless there is an error.
//
// Returns:
//
//   {hoodie} for chaining.
///

CreateCommand.prototype.run = function(options, callback) {

  'use strict';

  // optional callback
  callback = callback || function() {};

  if (options.browser) {
    options.browser = '--no-open-browser';
  } else {
    options.browser = '';
  }

  // install module
  this.execute(options, callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(options, callback) {

  'use strict';

  var self = this,
      nodeArgs = ['node_modules/hoodie-app/bin/start', options.browser];

  self.exec(which('node'), nodeArgs, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Could not start Hoodie');
      callback(err);
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('log', 'Hoodie up and running!');

  });

};

module.exports = {
  exec: function(hoodie) {

    'use strict';

    return new CreateCommand(hoodie);
  }
};
