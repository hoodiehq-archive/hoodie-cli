var Hoodie = require('../lib/hoodie');
var hoodie = new Hoodie();

var expect = require('expect.js');

/*!
 * Specification: hoodie.
 */

describe('hoodie', function() {
  it('should define hoodie.new', function() {
    expect(hoodie).to.have.property('new');
  });
});
