var Command = require('./util/command'),
    which = require('which').sync,
    util = require('util');


function CreateCommand(hoodie) {

  'use strict';

  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Start hoodie services.
//
// Options:
//
//   - `options` {Object} is data required to create an app
//     - `module` {String}
//   - [`callback`] {Function} is triggered after creating the app.
//     - `e` {Error} is null unless there is an error.
//
// Returns:
//
//   {hoodie} for chaining.
///

CreateCommand.prototype.run = function(callback) {

  'use strict';

  // install module
  this.execute(callback);

  return this.hoodie;
};

//
// Execute.
//

CreateCommand.prototype.execute = function(callback) {

  'use strict';

  var self = this;

  self.exec(which('npm'), ['start'], function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Could not start Hoodie');
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
