var Command = require('./util/command');
var which = require('which').sync;
var util = require('util');
var fs = require('graceful-fs');
var rmrf = require('rimraf');
var async = require('async');

var shell = require('shelljs');

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

  options.cwd = process.cwd();

  if (!!options.template.split('#')[1]) {
    var tmplArr = options.template.split('#');

    options.template = tmplArr[0];
    options.branch = tmplArr[1];
  }

  // create app
  this.execute(options, callback);

  return this.hoodie;
};



//
// fetch my-first-hoodie
//
CreateCommand.prototype.fetch = function (options, ctx, callback) {

  var self = ctx;
  var uri = 'https://github.com/' + options.template + '.git';
  var gitArgs = ['clone', '--depth=1', uri, self.getCacheDir() + 'my-first-hoodie'];

  // skip checkout if we already have a copy
  //
  if (!fs.existsSync(self.getCacheDir() + 'my-first-hoodie')) {

    if (options.branch) {
      gitArgs.push('-b', options.branch);
    }

    self.exec(which('git'), gitArgs, function (err) {

      if (err) {
        self.hoodie.emit('error', 'Could not fetch project from ' + uri);
        callback(err);
      }

      callback(null);

    });
  } else {
    callback(null);
  }

};


//
//
//
CreateCommand.prototype.cleanup = function(options, ctx, callback) {

  var self = ctx;
  var rmArg = self.getCacheDir() + 'my-first-hoodie' + '/.git';

  rmrf(rmArg, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Could not remove folder:');
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('info', 'removing .git folder');
    callback(null);
  });

};



//
// Rename.
//
CreateCommand.prototype.rename = function (options, ctx, callback) {

  var self = ctx;

  process.chdir(self.getCacheDir() + 'my-first-hoodie');

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

  self.hoodie.emit('info', 'Updated package.json');

  return callback(null, null);

};


//
// Install npm dependencies
//
CreateCommand.prototype.deps = function (options, ctx, callback) {

  var self = ctx;
  var npmArgs = ['install'];

  if (options.verbose) {
    npmArgs.push('--verbose');
  }

  process.chdir(self.getCacheDir() + 'my-first-hoodie');

  self.hoodie.emit('info', 'fetching npm dependencies:');

  self.exec(which('npm'), npmArgs, function(err) {

    if (err) {
      self.hoodie.emit('warn', 'Error installing dependencies:');
      process.exit(1);
      throw err;
    }

    //// if we receive a plugins array, lets install those as well.
    if (options.plugins.length) {
      self.hoodie.install(options);
    }

    callback(null);

  });

};

//
//
//
Command.prototype.copyToCwd = function (options, ctx, callback) {

  var self = ctx;
  var srcDir = self.getCacheDir() + 'my-first-hoodie' + '/';
  var targetDir = options.cwd + '/' + options.name + '/';

  if (shell.exec('mkdir ' + targetDir, {
    silent: true
  }).code !== 1) {

    self.hoodie.emit('info', 'copying files...');
    shell.exec('cp -R ' + srcDir + ' ' + targetDir);

    return callback(null);
  } else {
    self.hoodie.emit('err', 'directory already exists');
    process.exit(1);
  }

};


//
// Execute.
//
CreateCommand.prototype.execute = function (options) {

  var self = this;

  async.applyEachSeries([
    self.fetch,
    self.cleanup,
    self.rename,
    self.deps,
    self.copyToCwd
  ], options, self, function (err) {

    if (err) {
      self.hoodie.emit('error', 'something went wrong...');
    }

    self.hoodie.emit('info', 'created project at', options.cwd + '/' + options.name + '/');

    var sucStr  = 'Installed all dependencies\n';
    sucStr += 'You can now start using your hoodie app\n';
    sucStr += '\n';
    sucStr += '  cd ' + options.name + '\n';
    sucStr += '  hoodie start\n';

    self.hoodie.emit('info', sucStr);

  });

};


module.exports = {
  exec: function(hoodie) {
    return new CreateCommand(hoodie);
  }
};

