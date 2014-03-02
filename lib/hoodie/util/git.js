var shell = require('shelljs');

exports.bin = function () {

  var path = shell.which('git');

  // Add quotation in case the path contains a space
  // This happens on windows (c:\program files\nodejs\...)
  path = '"' + path + '"';

  return path;

};
