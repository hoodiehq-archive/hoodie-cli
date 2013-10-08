var Hoodie = require('../lib/hoodie');
var hoodie = require('../lib/main');

var expect = require('expect.js');

/*!
 * Specification: hoodie.
 */

describe('main', function() {

  it('should be an instance of Hoodie', function() {
    expect(hoodie).to.be.an(Hoodie);
  });
});
