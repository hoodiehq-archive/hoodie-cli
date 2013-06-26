var Command = require('./util/command'),
    which = require('which').sync,
    util = require('util');


function CreateCommand(hoodie) {

  'use strict';

  return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

//
// Installs Module.
//
// Installs a hoodie module
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

CreateCommand.prototype.run = function(options, callback) {

  'use strict';

  // require options
  if (!options) { throw new Error('requires option parameter'); }
  if (!options.module) { throw new Error('requires option.module parameter'); }

  // optional callback
  callback = callback || function() {};

  // validate options
  options.module = options.module || null;

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
      uri = 'git://github.com/hoodiehq/worker-' + options.module + '.git';

  self.exec(which('npm'), ['install', uri, '--save'], function (err) {

    if (err) {
      self.hoodie.emit('warn', 'Error installing module:');
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('log', 'Successfully installed ', options.module);

  });

};

module.exports = {
  create: function(hoodie) {

    'use strict';

    return new CreateCommand(hoodie);
  }
};

