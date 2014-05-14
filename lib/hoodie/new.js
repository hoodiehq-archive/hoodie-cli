var Command = require('./util/command');
var npmutils = require('./util/npm');
var gitUtils = require('./util/git');
var dirUtils = require('./util/dir');

var util = require('util');
var fs = require('graceful-fs');
var rmrf = require('rimraf');
var async = require('async');
var path = require('path');
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
  var customTmpl = options.template;
  delete options.template;

  var defaultTmpl = 'my-first-hoodie';

  if (!options.name) {
    options.name = defaultTmpl;
  }

  options.template = {
    template: customTmpl || defaultTmpl,
    entity: 'hoodiehq',
    repo: defaultTmpl,
    branch: undefined,
    uri: undefined
  };

  if (customTmpl) {
    var slug = customTmpl.split('/');

    if (customTmpl.indexOf('/') < 0 || slug.length > 2) {
      this.hoodie.emit('err', 'The provided template "' + customTmpl  + '" is not a valid GitHub slug.');
      return callback(new Error());
    }

    options.template.entity = slug[0];

    slug = slug[1].split('#');

    options.template.repo = slug[0];
    options.template.branch = slug[1];
  }

  options.template.uri = dirUtils.buildGitURI(options);
  options.plugins = options.plugins || [];
  options.cwd = process.cwd();
  options.cacheDir = dirUtils.getCacheDir();

  options.gitArgs = [
    'clone',
    '--depth=1',
    options.template.uri,
    options.cacheDir + options.template.repo || 'my-first-hoodie'
  ];

  options.npmArgs = [
    'install',
    '--production',
    '--cache-min 99999999'
  ];

  options.execArgs = {
    async: true,
    silent: true
  };

  if (options.verbose) {
    options.execArgs.silent = false;
    options.npmArgs.push('--loglevel', 'silly');
    options.gitArgs.push('--verbose');
  }

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

  // TODO: some semver check for whether the version we have
  // cached is out of date..
  //

  // skip checkout if we already have a copy
  //
  if (!fs.existsSync(options.cacheDir + options.template.repo)) {


    if (options.template.branch) {
      options.gitArgs.push('-b', options.template.branch);
    }

    shell.exec(gitUtils.bin() + ' ' + options.gitArgs.join(' '), options.execArgs, function(err) {

      if (err) {
        self.hoodie.emit('error', 'Could not fetch project from ' + options.template.uri);
        return callback(err);
      }

      return callback(null);

    });

  } else {
    return callback(null);
  }

};



//
// cleanup after 'git clone' - removes .git folder.
//
CreateCommand.prototype.cleanup = function(options, ctx, callback) {

  var self = ctx;

  if (!options.keep) {

    rmrf(options.rmArg, function(err) {

      if (err) {
        self.hoodie.emit('warn', 'Could not remove folder:');
        return callback(err);
      }

      self.hoodie.emit('info', 'removing .git folder');
    });

  }

  return callback(null);

};


//
// Rename.
//
CreateCommand.prototype.rename = function (options, ctx, callback) {

  var self = ctx;

  process.chdir(options.cacheDir + options.template.repo);

  // Replace {{hoodie_appname}} in package.json and www/index.html
  var readFile = function(file) {
    return fs.readFileSync(file)
      .toString()
      .replace(/\{\{hoodie_appname\}\}/gi, options.name);
  };

  var writeFile = function(file) {
    return fs.writeFileSync(file, readFile(file));
  };

  var files = [
    'package.json',
    path.normalize('./www/index.html')
  ];

  files
    .filter(fs.existsSync)
    .forEach(writeFile);

  self.hoodie.emit('info', 'Updated package.json');

  return callback(null);

};


//
// Install npm dependencies
//
CreateCommand.prototype.deps = function (options, ctx, callback) {

  var self = ctx;

  process.chdir(options.cacheDir + options.template.repo);

  self.hoodie.emit('info', 'fetching npm dependencies');

  shell.exec(npmutils.bin() + ' ' + options.npmArgs.join(' '), options.execArgs, function(err) {
    if (err) {
      self.hoodie.emit('warn', 'Error installing dependencies:');
      return callback(err);
    }

    // if we receive a plugins array, lets install those as well.
    if (options.plugins.length) {
      self.hoodie.install(options);
    }

    return callback(null);

  });

};


//
// Move template to cwd.
//
Command.prototype.copyToCwd = function (options, ctx, callback) {

  var self = ctx;
  var srcDir = options.cacheDir + options.template.repo;
  var targetDir = path.join(options.cwd, options.name);

  try {
    shell.mkdir('-p', path.dirname(targetDir));
  } catch(e) {
    self.hoodie.emit('err', 'directory already exists');
    return callback(new Error());
  }

  try {
    self.hoodie.emit('info', 'preparing ' + options.name + ' ...');
    shell.cp('-R', srcDir + '/.', targetDir);
  } catch(err) {
    callback(err);
    return;
  }

  callback(null);

};


//
// Execute.
//
CreateCommand.prototype.execute = function (options) {

  var self = this;

  async.applyEachSeries([
    dirUtils.ensureCacheDir,
    self.fetch,
    self.cleanup,
    self.rename,
    self.deps,
    self.copyToCwd
  ], options, self, function (err) {

    if (err) {

      var errStr = '\nSomething\'s wrong here...\n' +
        '\n' +
        'Try running the following commands to resolve possible issues:\n' +
        '\n' +
        '  hoodie cache clean\n' +
        '\n' +
        '  npm cache clean\n' +
        '\n' +
        'If none of the above works, run \"hoodie new ' + options.name + ' --verbose\"\n' +
        'and come talk to us on freenode #hoodie \n';

      self.hoodie.emit('error', errStr);
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('info', 'created project at', path.join(options.cwd, options.name));

    var sucStr = 'Installed all dependencies\n' +
      '\nYou can now start using your hoodie app\n' +
      '\n' +
      '  cd ' + options.name + '\n' +
      '  hoodie start\n';

    self.hoodie.emit('info', sucStr);

  });

};


module.exports = {
  exec: function (hoodie) {
    return new CreateCommand(hoodie);
  }
};

