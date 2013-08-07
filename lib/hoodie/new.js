var Command = require('./util/command');
var which = require('which').sync;
var util = require('util');
var fs = require('fs');

function CreateCommand() {
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



CreateCommand.prototype.cleanup = function() {

  var self = this,
      folder,
      rmArgs = ['-fr', process.cwd() + '/.git'];

  try {
    folder = fs.lstatSync(rmArgs[1]);

    if (folder.isDirectory()) {
      self.exec('rm', rmArgs, function(err) {

        if (err) {
          self.hoodie.emit('warn', 'Could not remove folder:');
          process.exit(1);
          throw err;
        }

        self.hoodie.emit('info', 'removing .git folder');

      });
    }
  }
  catch (err) {
    self.hoodie.emit('error', err);
  }

};



//
// fetch hoodie app template
//
CreateCommand.prototype.fetch = function (options, callback) {

  var self = this,
      uri = 'https://github.com/' + options.template + '.git',
      npmArgs = ['clone', '--depth=1', uri, options.name];

  self.exec(which('git'), npmArgs, function(err) {

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
CreateCommand.prototype.deps = function (options) {

  var self = this,
      npmArgs = ['install'];

  if (options.verbose) {
    npmArgs.push('--verbose');
  }

  self.exec(which('npm'), npmArgs, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Error installing dependencies:');
      process.exit(1);
      throw err;
    }

    var sucStr  = 'Installed all dependencies\n';
    sucStr += 'You can now start using your hoodie app\n';
    sucStr += '\n';
    sucStr += '\t cd ' + options.name + '\n';
    sucStr += '\t hoodie start';

    self.hoodie.emit('info', sucStr);

  });

};


//
// Rename.
//
CreateCommand.prototype.rename = function (options) {

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

  self.hoodie.emit('info', 'Replaced package.json');

};


//
// Execute.
//
CreateCommand.prototype.execute = function(options, callback) {

  var self = this;

  this.fetch(options, function (err) {
    if (err) {
      self.hoodie.emit('error', err);
      callback(err);
      return;
    }

    self.rename(options);

    self.cleanup();

    self.deps(options, function (err) {
      if (err) {
        self.hoodie.emit('error', err);
        callback(err);
        return;
      }
    });

  });

  self.hoodie.emit('info', 'created project at', process.cwd() + '/' + options.name + '/');

};


module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};
