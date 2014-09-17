var Command = require('./util/command');
var dirUtils = require('./util/dir');

var util = require('util');
var fs = require('graceful-fs');
var rmrf = require('rimraf');
var async = require('async');
var path = require('path');
var shell = require('shelljs');
var npm = require('npm');
var StdOutFixture = require('fixture-stdout');

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

  options.name = options.name || 'my-first-hoodie';

  options.tmpl_cfg = {
    template: options.template || dirUtils.getRepoFromTemplate(options),
    entity: dirUtils.getEntityFromTemplate(options),
    repo: dirUtils.getRepoFromTemplate(options),
    branch: dirUtils.getBranchFromTemplate(options),
    uri: undefined
  };

  options.tmpl_cfg.uri = dirUtils.buildGitURI(options);
  options.plugins = options.plugins || [];
  options.cwd = process.cwd();
  options.targetDir = dirUtils.appDir(options);

  if (options.ssh) {
    options.tmpl_cfg.template = '' + dirUtils.buildGitURI(options) + '';
  }

  options.npmArgs = {
    loglevel: 'silent'
  };

  if (options.verbose) {
    options.npmArgs.loglevel = 'verbose';
  }

  // optional callback
  callback = callback || function() {};

  this.execute(options, callback);

  this.insight.track('hoodie', 'new');

  return this.hoodie;

};

Command.prototype.mkdir = function (options, ctx, callback) {

  var self = ctx;

  try {
    shell.mkdir('-p', options.targetDir);
    return callback(null);
  } catch(e) {
    self.hoodie.emit('err', 'directory already exists');
    return callback(new Error());
  }

};

CreateCommand.prototype.checkCache = function (options, ctx, callback) {

  var self = ctx;

  var registryAvailable = function(npm, callback) {
    var host = npm.registry.registry.replace(/https+:\/\/|\//g, '');
    require('dns').resolve(host, function(err) {
      if (err) {
        self.hoodie.emit('warn', 'Error reaching the npm registry: Trying to install from cache');
        return callback({
          useCache: true
        });
      }
      self.hoodie.emit('info', 'The npm registry is available');
      callback();
    });
  };

  var latest = function(npm, callback) {
    var fixture = new StdOutFixture();
    fixture.capture(function() {
      return false;
    });

    npm.info(options.tmpl_cfg.template, function(err, pkg) {
      fixture.release();

      if (err) {
        self.hoodie.emit('warn', 'Error getting template info:');
        self.hoodie.emit('warn', err.message);
        return callback(err);
      }

      options.tmpl_cfg.latest = Object.keys(pkg)[0];
      callback();
    });
  };

  var latestCached = function(npm, callback) {
    var fixture = new StdOutFixture();
    fixture.capture(function() {
      return false;
    });

    npm.commands.cache([
      'ls',
      options.tmpl_cfg.template + '@' + options.tmpl_cfg.latest
    ], function(err, entries) {

      fixture.release();

      if (err) {
        self.hoodie.emit('warn', 'Error listing npm cache:');
        self.hoodie.emit('warn', err.message);
        return callback(err);
      }

      if (entries.length) {
        self.hoodie.emit('info', 'Installing from the npm cache');
        return callback({
          useCache: true
        });
      }

      self.hoodie.emit('info', 'Installing from the npm registry');
      return callback();
    });
  };

  npm.load(options.npmArgs, function(err, npm) {
    if (err) {
      self.hoodie.emit('warn', 'Error loading npm:');
      self.hoodie.emit('warn', err.message);
      return callback(err);
    }

    async.applyEachSeries([
      registryAvailable,
      latest,
      latestCached
    ], npm, function(err) {
      if (err && err.useCache) {
        options.npmArgs['cache-min'] = 1e12;
        options.npmArgs['no-registry'] = true;
        return callback();
      }
      if (err) {
        return callback(err);
      }
      callback();
    });
  });

};

CreateCommand.prototype.fetch = function (options, ctx, callback) {

  var self = ctx;

  self.hoodie.emit('info', 'This may take some time.');

  npm.load(options.npmArgs, function(err, npm) {
    if (err) {
      self.hoodie.emit('warn', 'Error loading npm:');
      self.hoodie.emit('warn', err.message);
      return callback(err);
    }

    var pkg = options.tmpl_cfg.template;

    if (options.tmpl_cfg.latest) {
      pkg += '@' + options.tmpl_cfg.latest;
    }

    npm.install(pkg, function(err, deps, pkg) {
      if (err) {
        self.hoodie.emit('warn', 'Error installing template:');
        self.hoodie.emit('warn', err.message);
        return callback(err);
      }

      options.srcDir = path.resolve(Object.keys(pkg)[0]);
      return callback(null);
    });
  });

};

//
// Copy template directory to target location.
//
Command.prototype.copyToCwd = function (options, ctx, callback) {

  var self = ctx;

  try {
    self.hoodie.emit('info', 'Preparing: ' + options.name + ' ...');
    shell.cp('-R', options.srcDir + '/', options.targetDir);
    return callback(null);
  } catch(err) {
    self.hoodie.emit('err', 'cannot copy directory ');
    return callback(err);
  }

};

//
// cleanup after 'git clone' - removes .git folder.
//
CreateCommand.prototype.cleanup = function(options, ctx, callback) {

  var self = ctx;

  rmrf(options.srcDir, function (err) {

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
    self.mkdir,
    self.checkCache,
    self.fetch,
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

