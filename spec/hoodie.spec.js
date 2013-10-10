var Hoodie = require('../lib/hoodie');
var hoodie = new Hoodie();

var expect = require('expect.js');

/*!
 * Specification: hoodie.
 */

describe('hoodie', function() {

  it('should define hoodie.help', function() {
    expect(hoodie).to.have.property('help');
  });

  it('should define hoodie.install', function() {
    expect(hoodie).to.have.property('install');
  });

  it('should define hoodie.new', function() {
    expect(hoodie).to.have.property('new');
  });

  it('should define hoodie.start', function() {
    expect(hoodie).to.have.property('start');
  });

  it('should define hoodie.uninstall', function() {
    expect(hoodie).to.have.property('uninstall');
  });

});

