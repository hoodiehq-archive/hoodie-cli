var Hoodie = require('../../lib/hoodie'),
    hoodie,
    options;

/*
 * Specification: hoodie.install(options, [callback])
 */

describe('hoodie.install(options, [callback])', function() {

  beforeEach(function() {
    hoodie = new Hoodie();
    options = {
      plugin: 'hoodieapp'
    };
    spyOn(hoodie, 'install');
  });

  it('should not require callback', function() {
    expect(function() {
      hoodie.install(options);
    }).not.toThrow();
  });

  describe('successfully install a plugin', function() {

    beforeEach(function() {
      hoodie.install.andCallFake(function(options, callback) {
        callback(null);
      });
    });

    it('should trigger called without an error', function(done) {
      hoodie.install(options, function(e) {
        expect(e).toBeNull();
        done();
      });
    });

    it('should trigger callback with an error', function(done) {
      hoodie.install(options, function(e) {
        expect(e).toEqual(null);
        done();
      });
    });
  });

});
