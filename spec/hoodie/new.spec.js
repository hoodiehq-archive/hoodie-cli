var Hoodie = require('../../lib/hoodie'),
    hoodie,
    options;

/*
 * Specification: hoodie.create(options, [callback])
 */

xdescribe('hoodie.new(options, [callback])', function() {

  'use strict';

    beforeEach(function() {
      hoodie = new Hoodie();
      options = {
        name: 'hoodieapp',
        template: '50p/yo-dawg'
      };
      spyOn(hoodie, 'version').andReturn('2.8.0');
      spyOn(hoodie, 'new');
    });

    it('should require options', function() {
      expect(function() {
          options = undefined;
          hoodie.new(options, function(e) {});
      }).toThrow();
    });

    it('should not require callback', function() {
      expect(function() {
        hoodie.new(options);
      }).not.toThrow();
    });

    describe('successfully created a project', function() {

      beforeEach(function() {
        hoodie.new.andCallFake(function(name, template,callback) {
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
        expect(e).toEqual(jasmine.any(Error));
        done();
      });
    });

    it('should trigger "error" event', function(done) {
      hoodie.on('error', function(e) {
        expect(e).toEqual(jasmine.any(Error));
        done();
      });
      hoodie.new(options);
    });

  });

});
