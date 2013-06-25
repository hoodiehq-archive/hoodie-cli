var shell = require('shelljs'),
    path = require('path'),
    bin = 'node ' + path.resolve(path.join(__dirname, '..', 'bin', 'hoodie.js'));

describe('$ hoodie commands <parameters>', function() {

  'use strict';

  beforeEach(function() {
    spyOn(process.stdout, 'write');
  });

  it('should support commands', function() {
    var process = shell.exec(bin + ' version', { silent: true });
    expect(process.output).toMatch(/^\w+\.\w+\.\w+/);
  });

  it('should support parameters', function() {
    var process = shell.exec(bin + ' --version', { silent: true });
    expect(process.output).toMatch(/^\w+\.\w+\.\w+/);
  });
});
