var fs = require('fs');
var _ = require('underscore');


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
        pkg.hoodie.plugins = _.uniq(
            pkg.hoodie.plugins.concat(plugins)
        );
        exports.writePackageJSON(p, pkg, callback);
    });
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
