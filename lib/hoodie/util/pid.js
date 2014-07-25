var fs = require('fs');
var path = require('path');

var internals = {

  path: null,

  writePid: function (path, force) {
    var pid = new Buffer(process.pid + '\n');
    var fd = fs.openSync(path, force ? 'w' : 'wx');
    var offset = 0;

    while (offset < pid.length) {
      offset += fs.writeSync(fd, pid, offset, pid.length - offset);
    }

    fs.closeSync(fd);
  },

  ulink: function (path) {
    try {
      fs.unlinkSync(path);
      internals.path = null;
    } catch (err) {

    }
  }

};

exports.create = function(path, force) {
  internals.path = path;
  internals.writePid(internals.path, force);
};

exports.remove = function () {
  internals.ulink(internals.path);
};

exports.exists = function () {
  return fs.existsSync(path.resolve('data/hoodie.pid'));
};

