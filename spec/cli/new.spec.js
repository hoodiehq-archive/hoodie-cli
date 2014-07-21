var hoodie = require('../../lib/main');
var CLI = require('../../lib/cli');
var cli;
var stdout;

var expect = require('expect.js');

/*
 * Specification: $ hoodie new
 */

describe('hoodie help new', function() {

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

  describe('$ hoodie new --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'], help: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

  describe('$ hoodie new -h', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'], h: true });
      expect(process.stdout.write.args[9]).to.match(/Usage/);
    });
  });

});


/*
 * Specification: $ hoodie new <name>
 */

describe('hoodie new <name>', function() {

  beforeEach(function() {
    cli = new CLI();
    this.sandbox.spy(process.stdout, 'write');
    this.sandbox.stub(hoodie, 'new');
  });

  describe('$ hoodie new "appname"', function() {
    it('should try to create the app', function() {
      var args = {
        name: 'appname',
        template: undefined,
        plugins: undefined,
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new "appname"', function() {
    it('should try to create the app verbosely', function() {
      var args = {
        name: 'appname',
        template: undefined,
        plugins: undefined,
        ssh: undefined,
        verbose: true
      };
      cli.argv({ _: ['new', 'appname'], verbose: true });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new "appname"', function() {
    it('should try to create the app verbosely without deleting the .git folder', function() {
      var args = {
        name: 'appname',
        template: undefined,
        plugins: undefined,
        ssh: undefined,
        verbose: true
      };
      cli.argv({ _: ['new', 'appname'], verbose: true});
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new appname 50p/massive-hoodie-yo', function() {
    it('should try to create the project', function() {
      var args = {
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: undefined,
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new appname --template 50p/massive-hoodie-yo', function() {
    it('should try to create the project', function() {
      var args = {
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: undefined,
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo#zipper', function() {
    it('should try to create the project', function() {
      var args = {
        name: 'appname',
        template: '50p/massive-hoodie-yo#zipper',
        plugins: undefined,
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo#zipper'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo', function() {
    it('should try to create the project', function() {
      var args = {
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: undefined,
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo --plugins users', function() {
    it('should try to create the project', function() {
      var args = {
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: 'users',
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo', 'users'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo --plugins users,shares', function() {
    it('should try to create the project', function() {
      var args = {
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: 'users,shares',
        ssh: undefined,
        verbose: undefined
      };
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo', 'users,shares'] });
      expect(hoodie.new.args[0][0]).to.eql(args);
      expect(hoodie.new.args[0][1]).to.be.a('function');
    });
  });

});
