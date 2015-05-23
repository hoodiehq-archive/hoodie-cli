var hoodie = require('../../lib/main');
var CLI = require('../../lib/cli');
var cli;
var stdout;

var expect = require('expect.js');

/*
 * Specification: $ hoodie start
 */

describe('hoodie help start', function() {

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

  describe('$ hoodie start --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

  describe('$ hoodie start -h', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'], h: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});


/*
 * Specification: $ hoodie start
 */

describe('hoodie start', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    this.sandbox.stub(hoodie, 'start');
  });

  describe('$ hoodie start', function() {
    it('should try to start the app', function() {
      var args = {
        noBrowser: undefined,
        www: undefined,
        sudo: undefined,
        'custom-ports': undefined,
        verbose: undefined,
        force: undefined
      };
      cli.argv({ _: ['start'] });
      expect(hoodie.start.args[0][0]).to.eql(args);
      expect(hoodie.start.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie start noBrowser', function() {
    it('should try to start the app with noBrowser', function() {
      var args = {
        noBrowser: true,
        www: undefined,
        sudo: undefined,
        'custom-ports': undefined,
        verbose: undefined,
        force: undefined
      };
      cli.argv({ _: ['start'], noBrowser: true});
      expect(hoodie.start.args[0][0]).to.eql(args);
      expect(hoodie.start.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie start --allow-sudo', function() {
    it('should try to start the app with --allow-sudo', function() {
      var args = {
        noBrowser: true,
        www: undefined,
        sudo: undefined,
        'custom-ports': undefined,
        verbose: undefined,
        force: undefined
      };
      cli.argv({ _: ['start'], noBrowser: true });
      expect(hoodie.start.args[0][0]).to.eql(args);
      expect(hoodie.start.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie start noBrowser --www "production"', function() {
    it('should try to start the app with noBrowser and --www', function() {
      var args = {
        noBrowser: true,
        www: 'production',
        sudo: undefined,
        'custom-ports': undefined,
        verbose: undefined,
        force: undefined
      };
      cli.argv({ _: ['start'], noBrowser: true, www: 'production'});
      expect(hoodie.start.args[0][0]).to.eql(args);
      expect(hoodie.start.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie start --custom-ports "6666,7777,8888"', function() {
    it('should try to start the app with --custom-ports', function() {
      var args = {
        noBrowser: undefined,
        www: undefined,
        sudo: undefined,
        'custom-ports': '6666,7777,8888',
        verbose: undefined,
        force: undefined
      };
      cli.argv({ _: ['start'], 'custom-ports': '6666,7777,8888'});
      expect(hoodie.start.args[0][0]).to.eql(args);
      expect(hoodie.start.args[0][1]).to.be.a('function');
    });
  });

});
