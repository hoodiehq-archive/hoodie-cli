var Hoodie = require('../../lib/hoodie');
var hoodie;
var options;

var expect = require('expect.js');

/*
 * Specification: hoodie.reset(options, [callback])
 */

describe('hoodie.reset(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    options = {
      password: 'password'
    };
  });

  describe('successfully reset password', function() {

    beforeEach(function() {
      this.sandbox.stub(hoodie, 'reset').returns(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger callback with an error', function() {
      hoodie.reset(options, function(e) {
        expect(e).to.eql(null);
      });
    });

  });

});
