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

function Hoodie() {

  'use strict';

  // initialize PhoneGap
  initialize.call(this);

  // initialize each command and inject the `hoodie` dependency.
  this.new = require('./hoodie/new').create(this);
  this.module = require('./hoodie/module').create(this);
  this.version = require('./hoodie/version').create(this);
}

util.inherits(Hoodie, events.EventEmitter);


//
// Initialize Hoodie.
//

function initialize() {

  'use strict';

  var self = this;

  // error events must always have a listener.
  self.on('error', function(e) {});
}

module.exports = Hoodie;
