var CLI = require('../../lib/cli');
var cli;

var expect = require('expect.js');

//
// Specification: $ hoodie help
//

describe('hoodie help', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
  });

  describe('$ hoodie help', function() {
    it('should output the usage information', function() {
      cli.argv({ _: [ 'help' ] });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

  describe('$ hoodie --help', function() {
    it('should output the usage information', function() {
      cli.argv({ _: [], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

  describe('$ hoodie -h', function() {
    it('should output the usage information', function() {
      cli.argv({ _: [], h: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});
