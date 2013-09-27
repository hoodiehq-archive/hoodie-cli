var Hoodie = require('../../lib/hoodie');
var hoodie;

var expect = require('expect.js');
/*
 * Specification: hoodie.start(options, [callback])
 */

describe('hoodie.start(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    this.sandbox.stub(hoodie, 'start').returns(function(options, callback) {
      callback(null);
    });
  });

  it('should not require callback', function() {
    expect(function() {
      hoodie.start();
    }).not.to.throwException();
  });

  describe('successfully start a hoodie app', function() {

    it('should trigger called without an error', function() {
      hoodie.start(function(e) {
        expect(e).to.be(null);
      });
    });

    it('should trigger callback with an error', function() {
      hoodie.start(function(e) {
        expect(e).to.eql(null);
      });
    });
  });

});
