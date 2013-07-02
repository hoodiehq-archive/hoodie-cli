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

  var self = this,
      npmArgs = ['start'];

  self.exec(which('npm'), npmArgs, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Could not start Hoodie');
      callback(err);
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('log', 'Hoodie up and running!');
    callback(null);

  });

};

module.exports = {
  exec: function(hoodie) {

    'use strict';

    return new CreateCommand(hoodie);
  }
};
