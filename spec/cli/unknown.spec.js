var CLI = require('../../lib/cli'),
    cli;

/*
 * Specification: $ hoodie unknown
 */

describe('hoodie unknown', function() {

  'use strict';

  beforeEach(function() {
      cli = new CLI();
      spyOn(process.stdout, 'write');
  });

  describe('$ hoodie noop', function() {
    it('should output the unknown command', function() {
      cli.argv({ _: ['noop'] });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch('noop');
    });
  });
});
