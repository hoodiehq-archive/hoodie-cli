var hoodie = require('./main');
var con = require('./cli/util/console');
var shell = require('shelljs');

//
// Command line interface object.
//

function CLI() {
  this.cli = this;
}


//
// check whether we're running an outdated version
// of hoodie-cli
//
hoodie.emit('checkUpdate');

try {

  shell.which('git', {
    async: true,
    silent: true
  }, function (err) {
    throw err;
  });

} catch (err) {
  hoodie.emit('warn', 'git command could not be found.');
  process.exit(1);
}


///
// Command line commands.
//

CLI.prototype.argv = require('./cli/argv');

CLI.prototype.new = require('./cli/new');
CLI.prototype.install = require('./cli/install');
CLI.prototype.uninstall = require('./cli/uninstall');
CLI.prototype.help = require('./cli/help');
CLI.prototype.start = require('./cli/start');
CLI.prototype.reset = require('./cli/reset');

CLI.prototype.unknown = require('./cli/unknown');
CLI.prototype.version = require('./cli/version');
CLI.prototype.logo = require('./cli/logo');


//
// CLI messages.
//

hoodie.on('info', function() {
  con.info.apply(this, arguments);
});

hoodie.on('success', function() {
  con.success.apply(this, arguments);
});

hoodie.on('warn', function() {
  con.warn.apply(this, arguments);
});

hoodie.on('err', function() {
  con.err.apply(this, arguments);
});

hoodie.on('raw', function() {
  con.raw.apply(this, arguments);
});


module.exports = CLI;
