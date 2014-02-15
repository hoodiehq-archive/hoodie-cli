var shell = require('shelljs');

exports.bin = function() {

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

