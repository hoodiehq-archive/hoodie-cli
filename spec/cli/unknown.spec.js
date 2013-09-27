var CLI = require('../../lib/cli');
var cli;

var expect = require('expect.js');

/*
 * Specification: $ hoodie unknown
 */

describe('hoodie unknown', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
  });

  describe('$ hoodie noop', function() {
    it('should output the unknown command', function() {
      cli.argv({ _: ['noop'] });
      expect(process.stdout.write.args[9]).to.match(/noop/);
    });
  });
});
