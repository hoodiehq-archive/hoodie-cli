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

  // defaults, defaults, heaps of defaults
  var originalTmpl = options.template || 'my-first-hoodie';

  delete options.template;

  if (!options.name) {
    options.name = 'my-first-hoodie';
  }

  options.template = {
    template: originalTmpl,
    entity: 'hoodiehq',
    repo: 'my-first-hoodie',
    branch: undefined,
    uri: undefined
  };

  if (originalTmpl.match('/')) {

    if (!!originalTmpl.split('/')) {
      options.template.entity = originalTmpl.split('/')[0];
      options.template.repo = originalTmpl.split('/')[1].split('#')[0];
    }

    if (!!originalTmpl.split('#')[1]) {
      options.template.branch = originalTmpl.split('#')[1];
    }

  }

  var uriStr = 'https://github.com/' + options.template.entity + '/';
  uriStr += options.template.repo + '.git';

  options.template.uri = uriStr;

  //options.name = options.name || 'my-first-hoodie';
  options.plugins = options.plugins || [];
  options.cwd = process.cwd();
  options.cacheDir = this.getCacheDir();

  options.gitArgs = [
    'clone',
    '--depth=1',
    options.template.uri,
    options.cacheDir + options.template.repo || 'my-first-hoodie'
  ];

  options.rmArg = options.cacheDir + options.template.repo + '/.git';

  // optional callback
  callback = callback || function() {};

  this.execute(options, callback);

  return this.hoodie;
};



//
// fetch my-first-hoodie
//
CreateCommand.prototype.fetch = function (options, ctx, callback) {

  var self = ctx;

  // TODO: some check for whether the version we have
  // cached is out of date..

  // skip checkout if we already have a copy
  //
  if (!fs.existsSync(options.cacheDir + options.template.repo)) {

    if (options.template.branch) {
      options.gitArgs.push('-b', options.template.branch);
    }

    self.exec(which('git'), options.gitArgs, function (err) {

      if (err) {
        self.hoodie.emit('error', 'Could not fetch project from ' + options.template.uri);
        callback(err);
      }

      callback(null);

    });

  } else {
    callback(null);
  }

};



//
// cleanup after 'git clone' - removes .git folder.
//
CreateCommand.prototype.cleanup = function(options, ctx, callback) {

  var self = ctx;

  rmrf(options.rmArg, function(err) {

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

  process.chdir(options.cacheDir + options.template.repo);

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
  var npmArgs = ['install', '--production', '--loglevel', 'silent'];

  if (options.verbose) {
    npmArgs.push('--verbose');
  }

  process.chdir(options.cacheDir + options.template.repo);

  self.hoodie.emit('info', 'fetching npm dependencies:');

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

    callback(null);

  });

};


//
// Move template to cwd.
//
Command.prototype.copyToCwd = function (options, ctx, callback) {

  var self = ctx;
  var srcDir = options.cacheDir + options.template.repo + '/';
  var targetDir = options.cwd + '/' + options.name + '/';

  if (shell.exec('mkdir ' + targetDir, {
    silent: true
  }).code !== 1) {

    self.hoodie.emit('info', 'preparing ' + options.name + '...');
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

