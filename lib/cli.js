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
CLI.prototype.install = require('./cli/install');
CLI.prototype.uninstall = require('./cli/uninstall');
CLI.prototype.help = require('./cli/help');
CLI.prototype.start = require('./cli/start');

CLI.prototype.unknown = require('./cli/unknown');
CLI.prototype.version = require('./cli/version');
CLI.prototype.logo = require('./cli/logo');

//
// CLI messages.
//

hoodie.on('log', function() {
  'use strict';
  con.log.apply(this, arguments);
});

hoodie.on('warn', function() {
  'use strict';
  con.warn.apply(this, arguments);
});

hoodie.on('error', function(e) {
  'use strict';
  con.error.call(this, e.message);
});

hoodie.on('raw', function() {
  'use strict';
  con.raw.apply(this, arguments);
});

module.exports = CLI;
