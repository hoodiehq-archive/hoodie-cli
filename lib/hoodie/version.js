var Command = require('./util/command');
var pkg = require('../../package.json');
var util = require('util');
var shelljs = require('shelljs');

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
    npmversion = shelljs.exec('npm -v', { silent: true }).output.trim();
  } catch(e) {
    console.error('Unable to detect npm version (%s).', e.toString());
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
