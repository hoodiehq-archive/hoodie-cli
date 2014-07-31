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

  return cProtocol + host + cSeparator + options.tmpl_cfg.entity + separator[0] + options.tmpl_cfg.repo + '.git';
};


//
// returns application name
//

exports.appDir = function (options) {
  return path.join(options.cwd, options.name);
};


exports.getRepoFromTemplate = function (options) {

  var tmpl = 'my-first-hoodie';

  if (!options.template) {
    return tmpl;
  }

  if (options.template) {
    return options.template.split('/').slice(-1)[0];
  }

};

exports.getEntityFromTemplate = function (options) {

  var entity = 'hoodiehq';

  if (!options.template) {
    return entity;
  }

  if (options.template) {
    return options.template.split('/')[0];
  }

};


exports.getBranchFromTemplate = function (options) {

  if (options.template) {
    return options.template.split('#').slice(-1)[0];
  }

};
