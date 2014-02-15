var path = require('path');
var fs = require('fs');
var shell = require('shelljs');

//
// get is cache dir
//
exports.getCacheDir = function () {
  var homedir = 'HOME';

  if (process.platform === 'win32') {
    homedir = 'USERPROFILE';
  }

  var cacheDir = path.join(process.env[homedir], '.hoodie/cache/');

  return cacheDir;
};


//
// Ensure the cache directory exists. For first install on Windows, it doesn't.
//
exports.ensureCacheDir = function (options, ctx, callback) {
  var cacheDir = exports.getCacheDir();

  if (!fs.existsSync(cacheDir)) {
    shell.mkdir('-p', cacheDir);
  }

  return callback(null);
};

//
// build repo url
//
exports.buildGitURI = function (options) {
  var protocols = ['https://', 'git@'];
  var separator = ['/', ':'];
  var host = 'github.com';

  var cProtocol = options.ssh ? protocols[1] : protocols[0];
  var cSeparator = options.ssh ? separator[1] : separator[0];

  return cProtocol + host + cSeparator + options.template.entity + separator[0] + options.template.repo + '.git';
};

