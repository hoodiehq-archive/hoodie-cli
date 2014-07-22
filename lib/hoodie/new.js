var Command = require('./util/command');
var npmutils = require('./util/npm');
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

  options.template.uri = dirUtils.buildGitURI(options);
  options.plugins = options.plugins || [];
  options.cwd = process.cwd();

  options.npmArgs = [
    'install'
  ];

  options.execArgs = {
    async: true,
    silent: true
  };

  if (options.verbose) {
    options.execArgs.silent = false;
    options.npmArgs.push('--loglevel', 'debug');
  }

  // optional callback
  callback = callback || function() {};

  this.execute(options, callback);

  return this.hoodie;

};

CreateCommand.prototype.fetch = function (options, ctx, callback) {

  var self = ctx;

  self.hoodie.emit('info', 'Fetching template... This may take some time.');

  shell.exec(
    npmutils.bin() + ' ' + options.npmArgs.join(' ') + ' ' + options.template.template,
    options.execArgs,
    function (err) {

    if (err) {
      self.hoodie.emit('warn', 'Error fetching template:');
      return callback(err);
    }

    // if we receive a plugins array, lets install those as well.
    //if (options.plugins.length) {
      //self.hoodie.install(options);
    //}

    return callback(null);

  });

};

Command.prototype.mkdir = function (options, ctx, callback) {

  var self = ctx;
  var targetDir = dirUtils.appDir(options);

  try {
    shell.mkdir('-p', path.dirname(targetDir));
    callback();
  } catch(e) {
    self.hoodie.emit('err', 'directory already exists');
    return callback(new Error());
  }

};

//
// Copy template directory to target location.
//
Command.prototype.copyToCwd = function (options, ctx, callback) {

  var self = ctx;
  var srcDir = path.resolve(path.join('node_modules', options.template.template));
  var targetDir = dirUtils.appDir(options);

  try {
    self.hoodie.emit('info', 'Preparing: ' + options.name + ' ...');
    shell.cp('-R', srcDir + '/.', targetDir);
  } catch(err) {
    self.hoodie.emit('err', 'cannot copy directory ');
    callback(err);
    return;
  }

  callback(null);

};

//
// cleanup after 'git clone' - removes .git folder.
//
CreateCommand.prototype.cleanup = function(options, ctx, callback) {

  var self = ctx;

  rmrf(path.resolve(path.join('node_modules', options.template.template)), function (err) {

    if (err) {
      self.hoodie.emit('error', 'Could not remove temporary template.');
      return callback(err);
    }

    return callback(null);

  });

};

//
// Rename.
//
CreateCommand.prototype.rename = function (options, ctx, callback) {

  var self = ctx;

  process.chdir(dirUtils.appDir(options));

  var isPackageJson = function(filename) {
    return filename.match(/\.json$/);
  };

  // Replace my-first-hoodie in package.json and www/index.html
  var readFile = function(file) {

    if (isPackageJson(file)) {
      var package_json = JSON.parse(fs.readFileSync(file));
      package_json.name = options.name;
      return JSON.stringify(package_json, null, 2);
    }

    return fs.readFileSync(file)
      .toString()
      .replace(/\{\{my-first-hoodie\}\}/gi, options.name);
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
// Execute.
//
CreateCommand.prototype.execute = function (options) {

  var self = this;

  async.applyEachSeries([
    self.fetch,
    self.mkdir,
    self.copyToCwd,
    self.cleanup,
    self.rename
  ], options, self, function (err) {

    if (err) {

      var errStr = '\nSomething\'s wrong here...\n' +
        '\n' +
        'Run \"hoodie new ' + options.name + ' --verbose\"\n' +
        'and come talk to us on freenode #hoodie \n';

      self.hoodie.emit('error', errStr);
      process.exit(1);
      throw err;
    }

    self.hoodie.emit('info', 'Created project at', path.join(options.cwd, options.name));

    var sucStr = 'You can now start using your hoodie app\n' +
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

