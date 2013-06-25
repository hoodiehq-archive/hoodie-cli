var clc = require("cli-color"),
    path = require('path'),
    fs = require('fs');

module.exports = function(argv, callback) {

  'use strict';

  [
      [".d$b.  .d$b.", "  .d$$$$$$b.  ", "  .d$$$$$$b.  ", ".d$$$$$$b.  ",  ".d$b.", ".d$$$$$$$$b."],
      ["$$$$$..$$$$$", ".$$$$$$$$$$$b ", ".$$$$$$$$$$$b ", "$$$$$$$$$$b ",  "$$$$$", "$$$$$$$$$$P'"],
      ["$$$$$$$$$$$$", "d$$$$$$$$$$$$b", "d$$$$$$$$$$$$b", "$$$$$$$$$$$b",  "$$$$$", "$$$$$$$$$$b."],
      ["$$$$$$$$$$$$", "Q$$$$$$$$$$$$P", "Q$$$$$$$$$$$$P", "$$$$$$$$$$$P",  "$$$$$", "$$$$$$$$$$P'"],
      ["$$$$$´`$$$$$", "'$$$$$$$$$$$$'", "'$$$$$$$$$$$$'", "$$$$$$$$$$P ",  "$$$$$", "$$$$$$$$$$b."],
      ["'Q$P'  'Q$P'", "  'Q$$$$$$P'  ", "  'Q$$$$$$P'  ", "'Q$$$$$$$P  ",  "'Q$P'", "'Q$$$$$$$$P'"]
  ].forEach(function(line) {
      var blue = clc.xterm(25);
      var green = clc.xterm(28);
      var yellow = clc.xterm(214);
      var orange = clc.xterm(202);
      var brown = clc.xterm(240);
      var red = clc.xterm(160);
      console.log(blue(line[0]) +
          green(line[1]) +
          yellow(line[2]) +
          orange(line[3]) +
          brown(line[4]) +
          red(line[5]));
  });

  console.log("\nSee 'hoodie --help' for more information.");

  if (!argv._ == 'logo') {

    // help file directory
    var basepath = path.join(__dirname, '..', '..', 'doc', 'cli'),
        filepath,
        data;

    // filename format: command.command.txt
    filepath = argv._.slice(0);
    filepath.push('txt');
    filepath = filepath.join('.');

    // full path
    filepath = path.join(basepath, filepath);

    // get help info and replace $0 with process name
    data = fs.readFileSync(filepath, 'utf8');
    data = data.trim().replace(/\$0/g, argv.$0);

    callback(null);
  }

};
