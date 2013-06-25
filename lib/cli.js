var hoodie = require('./main'),
    con = require('./cli/util/console');

//
// Command line interface object.
//

function CLI() {

  'use strict';

  // This can be prevented by using dependency injection
  this.cli = this;
}

///
// Command line commands.
//

CLI.prototype.argv = require('./cli/argv');

CLI.prototype.new = require('./cli/new');
CLI.prototype.module = require('./cli/module');
CLI.prototype.help = require('./cli/help');

CLI.prototype.unknown = require('./cli/unknown');
CLI.prototype.version = require('./cli/version');
CLI.prototype.logo = require('./cli/logo');

//
// CLI messages.
//

hoodie.on('log', function() {
  con.log.apply(this, arguments);
});

hoodie.on('warn', function() {
  con.warn.apply(this, arguments);
});

hoodie.on('error', function(e) {
  con.error.call(this, e.message);
});

hoodie.on('raw', function() {
  con.raw.apply(this, arguments);
});

module.exports = CLI;
