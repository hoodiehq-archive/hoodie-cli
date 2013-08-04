var hoodie = require('../../lib/hoodie'),
    hoodie;

/*
 * Specification: hoodie.version()
 */

describe('hoodie.version()', function() {

  beforeEach(function() {
    hoodie = new hoodie();
  });

  it('should return a version string', function() {
    expect(hoodie.version()).toEqual(jasmine.any(String));
  });

});
