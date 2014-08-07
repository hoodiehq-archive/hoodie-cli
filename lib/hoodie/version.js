var Command = require('./util/command');
var pkg = require('../../package.json');

var util = require('util');
var npm = require('npm');

function VersionCommand() {
  return Command.apply(this, arguments);
}

util.inherits(VersionCommand, Command);

//
// Version reporter.
//
// Report the version of or hoodie.
//

VersionCommand.prototype.run = function() {

  var info = 'Version: ' + pkg.version +
    ' (node ' + process.version +
    ', npm ' + npm.version +
    ', platform: ' + process.platform + ')\n';

  console.log(info);
};


module.exports = {
  exec: function(hoodie) {
    return new VersionCommand(hoodie);
  }
};

