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


/*
 * Specification: $ hoodie reset password
 */

describe('hoodie reset passwor', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    this.sandbox.stub(hoodie, 'reset');
  });

  describe('$ hoodie reset password', function() {
    it('should try to reset password', function() {
      cli.argv({ _: ['reset', 'password'] });
      expect(hoodie.reset.calledWith({
        password: 'password'
      })).to.be.ok();
    });
  });

});
