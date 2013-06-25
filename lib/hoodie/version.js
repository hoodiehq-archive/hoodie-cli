var Command = require('./util/command'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

function VersionCommand(hoodie) {

  'use strict';

  return Command.apply(this, arguments);
}

util.inherits(VersionCommand, Command);

//
// Version reporter.
//
// Report the version of or hoodie.
//

VersionCommand.prototype.run = function(options, callback) {

  'use strict';

  // load package.json
  var packagePath = path.join(__dirname, '..', '..', 'package.json'),
      packageJSON = JSON.parse(fs.readFileSync(packagePath), 'utf8');

  return packageJSON.version;
};


module.exports = {
  create: function(hoodie) {

    'use strict';

    return new VersionCommand(hoodie);
  }
};
