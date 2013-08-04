var hoodie = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ hoodie uninstall
 */

describe('hoodie uninstall', function() {

  beforeEach(function() {
    cli = new CLI();
    spyOn(process.stdout, 'write');
    stdout = process.stdout.write;
  });

  describe('$ hoodie help', function() {
    it('should include the command', function() {
      cli.argv({ _: ['help'] });
      expect(stdout.mostRecentCall.args[0]).toMatch(/\nUsage/i);
    });
  });

  describe('$ hoodie uninstall', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['uninstall'] });
      expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ uninstall/i);
    });
  });

  describe('$ hoodie uninstall --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['uninstall'], help: true });
      expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ uninstall/i);
    });
  });

});


/*
 * Specification: $ hoodie uninstall <plugin>
 */

describe('hoodie uninstall <plugin>', function() {

  beforeEach(function() {
    cli = new CLI();
    spyOn(process.stdout, 'write');
    spyOn(hoodie, 'uninstall');
  });

  describe('$ hoodie uninstall "users"', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall).toHaveBeenCalledWith({
        plugin: 'users'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie uninstall users', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall).toHaveBeenCalledWith({
        plugin: 'users',
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie uninstall --plugin users', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall).toHaveBeenCalledWith({
        plugin: 'users',
      },
      jasmine.any(Function));
    });
  });

});
