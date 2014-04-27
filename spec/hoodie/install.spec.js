var Hoodie = require('../../lib/hoodie');
var hoodie;
var options;

var expect = require('expect.js');

/*
 * Specification: hoodie.install(options, [callback])
 */

describe('hoodie.install(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    options = {
      plugin: 'hoodie-plugin-users',
      verbose: undefined
    };
  });

  it('should not require callback', function() {
    expect(function() {
      hoodie.install(options);
    }).to.not.throwException();
  });

  describe('successfully install a plugin', function() {

    beforeEach(function() {
      this.sandbox.stub(hoodie, 'install').returns(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger called without an error', function() {
      hoodie.install(options, function(e) {
        expect(e).to.eql(null);
      });
    });

    it('should trigger callback with an error', function() {
      hoodie.install(options, function(e) {
        expect(e).to.eql(null);
      });
    });

  });

});
