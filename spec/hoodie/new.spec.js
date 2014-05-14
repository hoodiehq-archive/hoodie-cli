var Hoodie = require('../../lib/hoodie');
var hoodie;
var options;

var expect = require('expect.js');

/*
 * Specification: hoodie.new(options, [callback])
 */

describe('hoodie.new(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    options = {
      name: 'hoodieapp',
      template: '50p/yo-dawg'
    };
    this.sandbox.stub(hoodie, 'new').returns(function(options, callback) {
      callback(null);
    });
  });

  it('should not require callback', function() {
    expect(function() {
      hoodie.new(options);
    }).to.not.throwException();
  });

  describe('successfully created a project', function() {

    it('should trigger called without an error', function() {
      hoodie.new(options, function(e) {
        expect(e).to.be(null);
      });
    });

    it('should trigger called without an error', function() {
      options.template = '50/yo-dawg#some-test';

      hoodie.new(options, function(e) {
        expect(e).to.be(null);
      });
    });

    it('should trigger callback with an error', function() {
      hoodie.new(options, function(e) {
        expect(e).to.be(null);
      });
    });


  });

  describe('rejected invalid slug', function() {

    it('should trigger callback with an error', function() {
      options.template = '50/yo-dawg/i-heard-yo-like#some-test';

      hoodie.new(options, function(e) {
        expect(e instanceof Error).to.be(true);
      });

      options.template = 'yo-dawg';

      hoodie.new(options, function(e) {
        expect(e instanceof Error).to.be(true);
      });

    });

  });

});
