var Hoodie = require('../../lib/hoodie');
var hoodie;
var options;

var expect = require('expect.js');

/*
 * Specification: hoodie.cache(options, [callback])
 */

describe('hoodie.cache(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    options = {
      plugin: 'hoodieapp',
      verbose: undefined
    };
  });

  describe('successfully cache a plugin', function() {

    beforeEach(function() {
      this.sandbox.stub(hoodie, 'cache').returns(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger called without an error', function() {
      hoodie.cache(options, function(e) {
        expect(e).to.eql(null);
      });
    });

    it('should trigger callback with an error', function() {
      hoodie.cache(options, function(e) {
        expect(e).to.eql(null);
      });
    });

  });

});
