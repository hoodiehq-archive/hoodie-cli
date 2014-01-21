var prompt = require('prompt');

//
// Console Info.
//
// Passes the parameters to `console.log`.
//
// Outputs:
//
//     $ [hoodie] message
//

module.exports.info = function() {

  var args = Array.prototype.slice.call(arguments);

  args.unshift('[hoodie]'.cyan);

  console.log.apply(this, args);
};

//
// Console Success.
//
// Passes the parameters to `console.log`.
//
// Outputs:
//
//     $ [hoodie] message
//

module.exports.success = function() {

  var args = Array.prototype.slice.call(arguments);

  args.unshift('[hoodie]'.green);

  console.log.apply(this, args);
};


//
// Console Warning.
//
// Passes the parameters to `console.warn`.
//
// Outputs:
//
//     $ [warning] message
//

module.exports.warn = function() {

  var args = Array.prototype.slice.call(arguments);

  args.unshift('[hoodie]'.yellow);

  console.log.apply(this, args);

};

//
// Console Error.
//
// Passes the parameters to `console.error`.
//
// Outputs:
//
//     $ [error] message
//

module.exports.err = function() {

  var args = Array.prototype.slice.call(arguments);

  args.unshift('[hoodie]'.red);

  console.log.apply(this, args);

};

//
// Console Prompt.
//
// Prompts for a value.
//
// Outputs:
//
//     $ [prompt] message:
//

module.exports.prompt = function(options, callback) {

  // prompt setup
  prompt.override = options.override;
  prompt.colors = false;
  prompt.message = '[prompt]'.green;
  prompt.delimiter = ' ';
  prompt.start();

  // begin prompting
  prompt.get(options.data, callback);

};

//
// RAW Console Log.
//
// Passes the parameters to `console.log` with no prefix.
//
// Outputs:
//
//     $ message
//

module.exports.raw = function() {

  var args = Array.prototype.slice.call(arguments);

  console.log.apply(this, args);

};
