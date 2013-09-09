var hoodie = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ hoodie new
 */

describe('hoodie help new', function() {

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

  describe('$ hoodie new', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'] });
      expect(stdout.mostRecentCall.args[0]).toMatch(/\nUsage:/i);
    });
  });

  describe('$ hoodie new --help', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'], help: true });
      expect(stdout.mostRecentCall.args[0]).toMatch(/\nUsage:/i);
    });
  });

  describe('$ hoodie new -h', function() {
    it('should output usage info', function() {
      cli.argv({ _: ['new'], h: true });
      expect(stdout.mostRecentCall.args[0]).toMatch(/\nUsage:/i);
    });
  });

});


/*
 * Specification: $ hoodie new <name>
 */

describe('hoodie new <name>', function() {

  beforeEach(function() {
    cli = new CLI();
    spyOn(process.stdout, 'write');
    spyOn(hoodie, 'new');
  });

  describe('$ hoodie new "appname"', function() {
    it('should try to create the app', function() {
      cli.argv({ _: ['new', 'appname'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: undefined
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie new appname 50p/massive-hoodie-yo', function() {
    it('should try to create the project', function() {
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: '50p/massive-hoodie-yo'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie new appname --template 50p/massive-hoodie-yo', function() {
    it('should try to create the project', function() {
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: '50p/massive-hoodie-yo'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo#zipper', function() {
    it('should try to create the project', function() {
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo#zipper'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: '50p/massive-hoodie-yo#zipper'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo', function() {
    it('should try to create the project', function() {
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: '50p/massive-hoodie-yo'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo --plugins users', function() {
    it('should try to create the project', function() {
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo', 'users'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: 'users'
      },
      jasmine.any(Function));
    });
  });

  describe('$ hoodie new -name appname --template 50p/massive-hoodie-yo --plugins users,shares', function() {
    it('should try to create the project', function() {
      cli.argv({ _: ['new', 'appname', '50p/massive-hoodie-yo', 'users,shares'] });
      expect(hoodie.new).toHaveBeenCalledWith({
        name: 'appname',
        template: '50p/massive-hoodie-yo',
        plugins: 'users,shares'
      },
      jasmine.any(Function));
    });
  });

});
