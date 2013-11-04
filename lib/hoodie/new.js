var Command = require('./util/command');
var which = require('which').sync;
var util = require('util');
var fs = require('graceful-fs');
var rmrf = require('rimraf');

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

  // optional callback
  callback = callback || function() {};

  // validate options
  options.name = options.name || 'my-first-hoodie';
  options.template = options.template || 'hoodiehq/my-first-hoodie';
  options.plugins = options.plugins || [];

  if (!!options.template.split('#')[1]) {
    var tmplArr = options.template.split('#');

    options.template = tmplArr[0];
    options.branch = tmplArr[1];
  }

  // create app
  this.execute(options, callback);

  return this.hoodie;
};



CreateCommand.prototype.cleanup = function() {

  var self = this;
  var rmArg = process.cwd() + '/.git';

  rmrf(rmArg, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Could not remove folder:');
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('info', 'removing .git folder');
  });

};



//
// fetch hoodie app template
//
CreateCommand.prototype.fetch = function (options, callback) {

  var self = this;
  var uri = 'https://github.com/' + options.template + '.git';
  var gitArgs = ['clone', '--depth=1', uri, options.name];

  if (options.branch) {
    gitArgs.push('-b', options.branch);
  }

  self.exec(which('git'), gitArgs, function(err) {

    if (err) {
      self.hoodie.emit('error', 'Could not fetch project from ' + uri);
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

  var self = this;
  var npmArgs = ['install'];

  if (options.verbose) {
    npmArgs.push('--verbose');
  }

  self.exec(which('npm'), npmArgs, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Error installing dependencies:');
      process.exit(1);
      throw err;
    }

    // if we receive a plugins array, lets install those as well.
    if (options.plugins.length) {
      self.hoodie.install(options);
    }

    var sucStr  = 'Installed all dependencies\n';
    sucStr += 'You can now start using your hoodie app\n';
    sucStr += '\n';
    sucStr += '  cd ' + options.name + '\n';
    sucStr += '  hoodie start\n';

    self.hoodie.emit('info', sucStr);

  });

};


//
// Rename.
//
CreateCommand.prototype.rename = function (options, callback) {

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

  this.hoodie.emit('info', 'Replaced package.json');

  return callback(null, null);

};


//
// Execute.
//
CreateCommand.prototype.execute = function(options, callback) {

  var self = this;

  this.fetch(options, function (err) {
    if (err) {
      return callback(err);
    }

    self.rename(options, function () {
      self.cleanup();

      self.deps(options, function (err) {
        if (err) {
          return callback(err);
        }

        self.hoodie.emit('info', 'created project at', process.cwd() + '/' + options.name + '/');
        return callback();
      });

    });

  });

};


module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

