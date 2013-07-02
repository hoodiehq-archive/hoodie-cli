var clc = require("cli-color");

module.exports = function() {

  'use strict';

  var logo = [
      [".d$b.  .d$b.", "  .d$$$$$$b.  ", "  .d$$$$$$b.  ", ".d$$$$$$b.  ",  ".d$b.", ".d$$$$$$$$b."],
      ["$$$$$..$$$$$", ".$$$$$$$$$$$b ", ".$$$$$$$$$$$b ", "$$$$$$$$$$b ",  "$$$$$", "$$$$$$$$$$P'"],
      ["$$$$$$$$$$$$", "d$$$$$$$$$$$$b", "d$$$$$$$$$$$$b", "$$$$$$$$$$$b",  "$$$$$", "$$$$$$$$$$b."],
      ["$$$$$$$$$$$$", "Q$$$$$$$$$$$$P", "Q$$$$$$$$$$$$P", "$$$$$$$$$$$P",  "$$$$$", "$$$$$$$$$$P'"],
      ["$$$$$´`$$$$$", "'$$$$$$$$$$$$'", "'$$$$$$$$$$$$'", "$$$$$$$$$$P ",  "$$$$$", "$$$$$$$$$$b."],
      ["'Q$P'  'Q$P'", "  'Q$$$$$$P'  ", "  'Q$$$$$$P'  ", "'Q$$$$$$$P  ",  "'Q$P'", "'Q$$$$$$$$P'"]
    ];

  logo.forEach(function(line) {
      var blue = clc.xterm(25),
          green = clc.xterm(28),
          yellow = clc.xterm(214),
          orange = clc.xterm(202),
          brown = clc.xterm(240),
          red = clc.xterm(160);

      console.log(
        blue(line[0]) +
        green(line[1]) +
        yellow(line[2]) +
        orange(line[3]) +
        brown(line[4]) +
        red(line[5])
      );
    });

};
