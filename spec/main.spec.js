var Hoodie = require('../lib/hoodie'),
    hoodie = require('../lib/main');

/*!
 * Specification: hoodie.
 */

describe('main', function() {

  'use strict';

  it('should be an instance of Hoodie', function() {
    expect(hoodie).toEqual(jasmine.any(Hoodie));
  });
});
