var Hoodie = require('../../lib/hoodie'),
    hoodie,
    options;

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
    spyOn(hoodie, 'new');
  });

  it('should not require callback', function() {
    expect(function() {
      hoodie.new(options);
    }).not.toThrow();
  });

  describe('successfully created a project', function() {

    beforeEach(function() {
      hoodie.new.andCallFake(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger called without an error', function(done) {
      hoodie.new(options, function(e) {
        expect(e).toBeNull();
        done();
      });
    });

    it('should trigger callback with an error', function(done) {
      hoodie.new(options, function(e) {
        expect(e).toEqual(null);
        done();
      });
    });
  });

});
