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

  xdescribe('successfully uninstall a plugin', function() {

    beforeEach(function() {
      hoodie.uninstall.andCallFake(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger called without an error', function(done) {
      hoodie.uninstall(options, function(e) {
        expect(e).to.be(null);
        done();
      });
    });

    it('should trigger callback with an error', function(done) {
      hoodie.uninstall(options, function(e) {
        expect(e).to.eql(null);
        done();
      });
    });
  });

});

