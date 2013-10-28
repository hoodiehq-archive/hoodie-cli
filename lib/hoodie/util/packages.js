/*jshint -W079 */

var fs = require('graceful-fs');
var _ = require('underscore');

//
// Modifies the hoodie.plugins property of a package.json file
// Use extendPlugins() and removePlugins() instead of calling this directly
//

exports._modifyPlugins = function (p, transform, callback) {
  exports.readPackageJSON(p, function (err, pkg) {
    if (err) {
      return callback(err);
    }
    if (!pkg.hoodie) {
      pkg.hoodie = {};
    }
    if (!pkg.hoodie.plugins) {
      pkg.hoodie.plugins = [];
    }
    pkg.hoodie.plugins = transform(pkg.hoodie.plugins);
    exports.writePackageJSON(p, pkg, callback);
  });
};

//
// Updates the hoodie.plugin property of a package.json file
//
// Options:
//
//   - `p           {String} the path to the package.json file to update
//   -  plugins     {Array} an array of plugin package names or paths to add
//   -  callback    {Function} called after package.json has written
//

exports.extendPlugins = function (p, plugins, callback) {
  return exports._modifyPlugins(p, function (ps) {
    return _.uniq(ps.concat(plugins));
  }, callback);
};

//
// Updates the hoodie.plugin property of a package.json file, removing
// the names plugins from the array
//
// Options:
//
//   - `p           {String} the path to the package.json file to update
//   -  plugins     {Array} an array of plugin package names or paths to remove
//   -  callback    {Function} called after package.json has written
//

exports.removePlugins = function (p, plugins, callback) {
  return exports._modifyPlugins(p, function (ps) {
    return ps.filter(function (plugin) {
      return !(_.contains(plugins, plugin));
    });
  }, callback);
};

//
// Reads the package.json file, returning the parsed JSON
//
// Options:
//
//   - `p           {String} the path to the package.json file to read
//   -  callback    {Function} called after package.json has been read
//

exports.readPackageJSON = function (p, callback) {
  fs.readFile(p, function (err, buf) {
    if (err) {
      return callback(err);
    }
    var pkg;
    try {
      pkg = JSON.parse(buf.toString());
    }
    catch (e) {
      return callback(e);
    }
    return callback(null, pkg);
  });
};

//
// Writes the package.json file
//
// Options:
//
//   - `p           {String} the path to the package.json file to write
//   -  pkg         {Object} the json object to write to package.json
//   -  callback    {Function} called after package.json has been written
//

exports.writePackageJSON = function (p, pkg, callback) {
  var output = JSON.stringify(pkg, null, 2);
  fs.writeFile(p, output, callback);
};
