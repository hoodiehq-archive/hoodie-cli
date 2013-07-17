var Hoodie = require('../lib/hoodie'),
    hoodie = new Hoodie();

/*!
 * Specification: hoodie.
 */

describe('hoodie', function() {
  it('should define hoodie.new', function() {
    expect(hoodie.new).toEqual(jasmine.any(Function));
  });
});
