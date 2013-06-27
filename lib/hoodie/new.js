var Command = require('./util/command'),
    which = require('which').sync,
    path = require('path'),
    util = require('util'),
    fs = require('fs');

function CreateCommand(hoodie) {

  'use strict';

  return Command.apply(this, arguments);
}


util.inherits(CreateCommand, Command);


//
// Create a New App.
//
//  Creates an project on the local filesystem.
//
//  Options:
//
//    - `options` {Object} is data required to create an app
//      - `name` {String} is a directory path for the app.
//      - `template` {String} is the application name (default: 'hoodiehq/my-first-hoodie')
//    - [`callback`] {Function} is triggered after creating the app.
//      - `err` {Error} is null unless there is an error.
//
//  Returns:
//
//    {hoodie} for chaining.
//
CreateCommand.prototype.run = function(options, callback) {

  'use strict';

  // require options
  if (!options.name) { throw new Error('requires option.name parameter'); }

  // optional callback
  callback = callback || function() {};

  // validate options
  options.name = options.name || 'my-first-hoodie';
  options.template = options.template || 'hoodiehq/my-first-hoodie';

  // create app
  this.execute(options, callback);

  return this.hoodie;
};



//
// fetch hoodie app template
//
CreateCommand.prototype.fetch = function (options, callback) {

  'use strict';

  var self = this,
      uri = 'https://github.com/' + options.template + '.git';

  self.exec('git', ['clone', uri , options.name], function(err) {

    if (err) {
      self.hoodie.emit('error', err);
      callback(err);
      return;
    }

    callback(null);

  });

};


//
// Install npm dependencies
//
CreateCommand.prototype.deps = function (options, callback) {

  'use strict';

  var self = this;

  self.exec(which('npm'), ['install'], function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Error installing dependencies:');
      process.exit(1);
      throw err;
    }

    var sucStr  = 'Installed all dependencies\n';
        sucStr += 'You can now start using your hoodie app\n';
        sucStr += '\n';
        sucStr += '\t cd ' + options.name + '\n',
        sucStr += '\t hoodie start';

    self.hoodie.emit('log', sucStr);

  });

};


//
// Rename.
//
CreateCommand.prototype.rename = function (options) {

  'use strict';

  var self = this;

  process.chdir(options.name);

  // Replace {{hoodie_appname}} in package.json and www/index.html
  var files = [
    'package.json',
    './www/index.html'
  ];

  files.forEach(function(file) {
    fs.writeFileSync(file,
      fs.readFileSync(file).toString().replace(/\{\{hoodie_appname\}\}/gi, options.name)
    );
  });

  self.hoodie.emit('log', 'Replaced package.json');

};


//
// Execute.
//
CreateCommand.prototype.execute = function(options, callback) {

  'use strict';

  console.log('execute options', options);

  var self = this;

  this.fetch(options, function (err) {
    if (err) {
      self.hoodie.emit('error', err);
      callback(err);
      return;
    }

    self.rename(options);

    self.deps(function (err) {
      if (err) {
        self.hoodie.emit('error', err);
        callback(err);
        return;
      }
    });

  });

  self.hoodie.emit('log', 'created project at', process.cwd() + '/' + options.name + '/');
  callback(null);

};


module.exports = {
  create: function(hoodie) {

    'use strict';

    return new CreateCommand(hoodie);
  }
};
