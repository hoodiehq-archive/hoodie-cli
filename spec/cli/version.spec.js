var hoodie = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli;

/*
 * Specification: $ hoodie version
 */

xdescribe('hoodie --version', function() {

  beforeEach(function() {
    cli = new CLI();
    spyOn(process.stdout, 'write');
    spyOn(hoodie, 'version').andReturn({
      hoodie: '2.8.0'
    });
  });

  describe('$ hoodie help', function() {
    it('outputs info on the version command', function() {
      cli.argv({ _: [ 'help' ] });
      expect(process.stdout.write.mostRecentCall.args[0])
          .toMatch(/Commands:[\w\W]*\s+version/i);
    });
  });

  describe('$ hoodie version', function() {
    it('should output with the format x.x.x', function() {
      cli.argv({ _: [ 'version' ] });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('$ hoodie --version', function() {
    it('should output with the format x.x.x', function() {
      cli.argv({ _: [], version: true });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe('$ hoodie -v', function() {
    it('should output with the format x.x.x', function() {
      cli.argv({ _: [], v: true });
      expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
    });
  });
});
