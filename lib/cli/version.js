var hoodie = require('../main');

//
// $ hoodie version
//
// Outputs the version to the console.
//

module.exports = function() {

  this.logo();

  console.log(hoodie.version());
};
