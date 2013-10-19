var hoodie = require('../../lib/main');
var CLI = require('../../lib/cli');
var cli;
var stdout;

var expect = require('expect.js');

/*
 * Specification: $ hoodie uninstall
 */

describe('hoodie uninstall', function() {

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

  describe('$ hoodie uninstall --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['uninstall'], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});


/*
 * Specification: $ hoodie uninstall <plugins>
 */

describe('hoodie uninstall <plugins>', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    this.sandbox.stub(hoodie, 'uninstall');
    this.args = {
      plugins: 'users',
      verbose: undefined
    };
  });

  describe('$ hoodie uninstall users', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall.args[0][0]).to.eql(this.args);
      expect(hoodie.uninstall.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie uninstall users', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall.args[0][0]).to.eql(this.args);
      expect(hoodie.uninstall.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie uninstall --plugins users', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall.args[0][0]).to.eql(this.args);
      expect(hoodie.uninstall.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie uninstall --plugins users,shares', function() {
    it('should try to uninstall a plugin', function() {
      this.args.plugins = 'users,shares';

      cli.argv({ _: ['uninstall', 'users,shares'] });
      expect(hoodie.uninstall.args[0][0]).to.eql(this.args);
      expect(hoodie.uninstall.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie uninstall --p users,shares', function() {
    it('should try to uninstall a plugin', function() {
      this.args.plugins = 'users,shares';

      cli.argv({ _: ['uninstall', 'users,shares'] });
      expect(hoodie.uninstall.args[0][0]).to.eql(this.args);
      expect(hoodie.uninstall.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie uninstall --p users', function() {
    it('should try to uninstall a plugin', function() {
      cli.argv({ _: ['uninstall', 'users'] });
      expect(hoodie.uninstall.args[0][0]).to.eql(this.args);
      expect(hoodie.uninstall.args[0][1]).to.be.a('function');
    });
  });

});
