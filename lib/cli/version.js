var hoodie = require('../main');

//
// $ hoodie version
//
// Outputs the version to the console.
//

module.exports = function() {

  'use strict';

  this.logo();

  console.log(hoodie.version());
};
