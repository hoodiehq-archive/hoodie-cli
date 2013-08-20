var hoodie = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ hoodie install
 */

describe('hoodie install', function() {

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

  describe('$ hoodie install', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['install'] });
      expect(stdout.mostRecentCall.args[0]).toMatch(/Usage:/i);
    });
  });

  describe('$ hoodie install --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['install'], help: true });
      expect(stdout.mostRecentCall.args[0]).toMatch(/\nUsage:/i);
    });
  });

});


/*
 * Specification: $ hoodie install <plugins>
 */

describe('hoodie install <plugins>', function() {

  beforeEach(function() {
    cli = new CLI();
    spyOn(process.stdout, 'write');
    spyOn(hoodie, 'install');
  });

  describe('$ hoodie install "users"', function() {
    it('should try to install a plugins', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install).toHaveBeenCalledWith({
        plugins: 'users'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie install users', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install).toHaveBeenCalledWith({
        plugins: 'users'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie install --plugin users', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install).toHaveBeenCalledWith({
        plugins: 'users'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie install --plugin users,shares', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users,shares'] });
      expect(hoodie.install).toHaveBeenCalledWith({
        plugins: 'users,shares'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie install -p users', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install).toHaveBeenCalledWith({
        plugins: 'users'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie install -p users,shares', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users,shares'] });
      expect(hoodie.install).toHaveBeenCalledWith({
        plugins: 'users,shares'
      },
      jasmine.any(Function));
    });
  });

});
