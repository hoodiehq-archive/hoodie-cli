var path = require('path');

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
// build repo url
//
exports.buildGitURI = function (options) {
  var protocols = ['git@', 'https://'];
  var separator = ['/', ':'];
  var host = 'github.com';

  var cProtocol = options.ssh ? protocols[1] : protocols[0];
  var cSeparator = options.ssh ? separator[1] : separator[0];

  return cProtocol + host + cSeparator + options.template.entity + separator[0] + options.template.repo + '.git';
};


//
// returns application name
//

exports.appDir = function (options) {
  return path.join(options.cwd, options.name);
};

