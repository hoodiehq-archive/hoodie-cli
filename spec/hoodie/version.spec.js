var hoodie = require('../../lib/hoodie'),
    fs = require('fs'),
    hoodie;

/*
 * Specification: hoodie.version()
 */

describe('hoodie.version()', function() {

  'use strict';

  beforeEach(function() {
    hoodie = new hoodie();
  });

  it('should return a version string', function() {
    expect(hoodie.version()).toEqual(jasmine.any(String));
  });

});
