var CLI = require('../../lib/cli'),
    cli;

//
// Specification: $ hoodie help
//

describe('hoodie help', function() {

  'use strict';

  beforeEach(function() {
    cli = new CLI();
    spyOn(process.stdout, 'write');
  });

  describe('$ hoodie help', function() {
    it('should output the usage information', function() {
      cli.argv({ _: [ 'help' ] });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });
  });

  describe('$ hoodie --help', function() {
    it('should output the usage information', function() {
      cli.argv({ _: [], help: true });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });
  });

  describe('$ hoodie -h', function() {
    it('should output the usage information', function() {
      cli.argv({ _: [], h: true });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });
  });

});
