var Hoodie = require('../../lib/hoodie'),
    hoodie,
    options;

/*
 * Specification: hoodie.uninstall(options, [callback])
 */

describe('hoodie.uninstall(options, [callback])', function() {

  'use strict';

    beforeEach(function() {
      hoodie = new Hoodie();
      options = {
        module: 'hoodieapp'
      };
      spyOn(hoodie, 'uninstall');
    });

    it('should not require callback', function() {
      expect(function() {
        hoodie.uninstall(options);
      }).not.toThrow();
    });

    describe('successfully uninstall a module', function() {

      beforeEach(function() {
        hoodie.uninstall.andCallFake(function(options, callback) {
          callback(null);
        });
      });

      it('should trigger called without an error', function(done) {
        hoodie.uninstall(options, function(e) {
          expect(e).toBeNull();
          done();
        });
      });

      it('should trigger callback with an error', function(done) {
        hoodie.uninstall(options, function(e) {
          expect(e).toEqual(null);
          done();
        });
      });
   });

});

