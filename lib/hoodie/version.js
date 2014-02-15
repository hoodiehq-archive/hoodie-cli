var Command = require('./util/command');
var pkg = require('../../package.json');

var util = require('util');
var shell = require('shelljs');

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

  var npmversion = 'n/a';

  try {
    var child = shell.exec('npm -v', { silent: true });
    if (child.code !== 0) {
      throw child.output;
    }
    npmversion = child.output.trim();
  } catch(e) {
    this.hoodie.emit('err', 'Unable to detect npm version (' + e.toString() + ').');
  }

  var info = 'Version: ' + pkg.version;
  info += ' (node ' + process.version;
  info += ', npm ' + npmversion;
  info += ', platform: ' + process.platform + ')\n';

  console.log(info);
};


module.exports = {
  exec: function(hoodie) {
    return new VersionCommand(hoodie);
  }
};

