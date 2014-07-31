var Insight = require('insight');
var pkg = require('../../../package.json');

module.exports = function () {

  var insight = new Insight({
      trackingCode: 'UA-53355776-2',
      packageName: pkg.name,
      packageVersion: pkg.version
  });

  insight.optOut = false;

  return insight;

};

