var Hoodie = require('../../lib/hoodie'),
    hoodie,
    options;

/*
 * Specification: hoodie.start(options, [callback])
 */

describe('hoodie.start(options, [callback])', function() {

  'use strict';

    beforeEach(function() {
      hoodie = new Hoodie();
      spyOn(hoodie, 'start');
    });

    it('should not require callback', function() {
      expect(function() {
        hoodie.start();
      }).not.toThrow();
    });

    describe('successfully start a hoodie app', function() {

      beforeEach(function() {
        hoodie.start.andCallFake(function(callback) {
          callback(null);
        });
      });

      it('should trigger called without an error', function(done) {
        hoodie.start(function(e) {
          expect(e).toBeNull();
          done();
        });
      });

      it('should trigger callback with an error', function(done) {
        hoodie.start(function(e) {
          expect(e).toEqual(null);
          done();
        });
      });
   });

});
