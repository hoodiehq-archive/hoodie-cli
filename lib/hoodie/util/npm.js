var shell = require('shelljs');

var path = require('path');

exports.bin = function () {

  var path = shell.which('npm');

  // On windows we'll add .cmd
  if (process.platform === 'win32') {
    path += '.cmd';
  }

  // Add quotation in case the path contains a space
  // This happens on windows (c:\program files\nodejs\...)
  path = '"' + path + '"';

  return path;

};


//
// gets npm cache dir
//
exports.getNPMCacheDir = function () {
  return path.join(process.env.NVM_PATH, '../node_modules/');
};

