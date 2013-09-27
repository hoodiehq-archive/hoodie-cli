var Hoodie = require('../../lib/hoodie');
var hoodie;
var options;

var expect = require('expect.js');

/*
 * Specification: hoodie.uninstall(options, [callback])
 */

describe('hoodie.uninstall(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    options = {
      plugin: 'hoodieapp'
    };
    this.sandbox.spy(hoodie, 'uninstall');
  });

  it('should not require callback', function() {
    expect(function() {
      hoodie.uninstall(options);
    }).to.not.throwException();
  });

  describe('successfully uninstall a plugin', function() {

    beforeEach(function() {
      hoodie.uninstall(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger called without an error', function() {
      hoodie.uninstall(options, function(e) {
        expect(e).to.be(null);
      });
    });

    it('should trigger callback with an error', function() {
      hoodie.uninstall(options, function(e) {
        expect(e).to.eql(null);
      });
    });
  });

});

