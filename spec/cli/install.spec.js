var hoodie = require('../../lib/main');
var CLI = require('../../lib/cli');
var cli;
var stdout;

var expect = require('expect.js');

/*
 * Specification: $ hoodie install
 */

describe('hoodie install', function() {

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

  describe('$ hoodie install --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['install'], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});


/*
 * Specification: $ hoodie install <plugins>
 */

describe('hoodie install <plugins>', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    this.sandbox.stub(hoodie, 'install');
  });

  describe('$ hoodie install "users"', function() {
    it('should try to install a plugins', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install.calledWith({
        plugins: 'users',
        verbose: undefined
      })).to.be.ok();
    });
  });

  describe('$ hoodie install users', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install.calledWith({
        plugins: 'users',
        verbose: undefined
      })).to.be.ok();
    });
  });

  describe('$ hoodie install --plugin users', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install.calledWith({
        plugins: 'users',
        verbose: undefined
      })).to.be.ok();
    });
  });

  describe('$ hoodie install --plugin users,shares', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users,shares'] });
      expect(hoodie.install.calledWith({
        plugins: 'users,shares',
        verbose: undefined
      })).to.be.ok();
    });
  });

  describe('$ hoodie install -p users', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users'] });
      expect(hoodie.install.calledWith({
        plugins: 'users',
        verbose: undefined
      })).to.be.ok();
    });
  });

  describe('$ hoodie install -p users,shares', function() {
    it('should try to install a plugin', function() {
      cli.argv({ _: ['install', 'users,shares'] });
      expect(hoodie.install.calledWith({
        plugins: 'users,shares',
        verbose: undefined
      })).to.be.ok();
    });
  });

});
