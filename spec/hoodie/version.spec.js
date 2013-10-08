var hoodie = require('../../lib/hoodie');
var hoodie;

var expect = require('expect.js');

/*
 * Specification: hoodie.version()
 */

describe('hoodie.version()', function() {

  beforeEach(function() {
    hoodie = new hoodie();
  });

  it('should return a version string', function() {
    expect(hoodie.version).to.be.ok();
  });

});
