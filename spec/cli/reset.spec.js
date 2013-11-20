var hoodie = require('../../lib/main');
var CLI = require('../../lib/cli');
var cli;
var stdout;

var expect = require('expect.js');

/*
 * Specification: $ hoodie reset
 */

describe('hoodie reset', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    stdout = process.stdout.write;
  });

  describe('$ hoodie help', function() {
    it('should include the command', function() {
      cli.argv({ _: ['help'] });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

  describe('$ hoodie reset --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['reset'], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});

