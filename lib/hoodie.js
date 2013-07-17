var events = require('events'),
    util = require('util');

//
// Hoodie object.
//
// Events:
//
//   - `error` {Event} triggered with info compatible with console.error.
//   - `log` {Event} triggered with info compatible with console.log.
//   - `warn` {Event} triggered with info compatible with console.warn.
//   - `raw` {Event} trigger with info that should not be formatted.
//
function initialize() {

  'use strict';

  /*jshint validthis:true */

  // error events must always have a listener.
  this.on('error', function(err) {
    console.log(err);
  });
}

function Hoodie() {

  'use strict';

  // initialize Hoodie
  initialize.call(this);

  // initialize each command and inject the `hoodie` dependency.
  this.new = require('./hoodie/new').exec(this);
  this.install = require('./hoodie/install').exec(this);
  this.uninstall = require('./hoodie/uninstall').exec(this);
  this.start = require('./hoodie/start').exec(this);
  this.version = require('./hoodie/version').exec(this);
}


util.inherits(Hoodie, events.EventEmitter);


//
// Initialize Hoodie.
//


module.exports = Hoodie;
