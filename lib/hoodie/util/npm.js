var shell = require('shelljs');
var npm = require('npm');
var semver = require('semver');

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
// determine whether a given npm package is out of date
//
exports.isOutdated = function (pkg, callback) {

  npm.load({}, function() {

    npm.commands.view([pkg.name, 'dist-tags.latest'], true, function (err, pkgMeta) {
      var latest = Object.keys(pkgMeta)[0];
      var current = pkg.version;

      if (err) {
        return callback(err, null);
      }

      return callback(null, semver.gt(latest, current));
    });

  });

};

