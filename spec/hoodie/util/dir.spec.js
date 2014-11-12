var dir = require('../../../lib/hoodie/util/dir');
var options;

var expect = require('expect.js');

/*
 * Specification: dir.buildGitURI(options)
 */

describe('dir.buildGitURI(options)', function() {
  beforeEach(function() {
    options = {
      tmpl_cfg: {
        entity: 'hoodiehq',
        repo: 'my-first-hoodie'
      }
    };
  });

  it('should build a non-SSH GitHub URL by default', function() {
    expect(dir.buildGitURI(options)).to.be('https://github.com/hoodiehq/my-first-hoodie.git');
  })

  it('should build a non-SSH GitHub URL', function() {
    options.ssh = false;
    expect(dir.buildGitURI(options)).to.be('https://github.com/hoodiehq/my-first-hoodie.git');
  })

  it('should build an SSH GitHub URL', function() {
    options.ssh = true;
    expect(dir.buildGitURI(options)).to.be('git@github.com:hoodiehq/my-first-hoodie.git');
  });
});

