var hoodie = require('../../lib/main');
var CLI = require('../../lib/cli');
var cli;
var stdout;
var args;

var expect = require('expect.js');

/*
 * Specification: $ hoodie cache
 */

describe('hoodie cache', function() {

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

  describe('$ hoodie cache --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['cache'], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});


/*
 * Specification: $ hoodie cache <command>
 */

describe('hoodie cache <command>', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    this.sandbox.stub(hoodie, 'cache');
  });

});
