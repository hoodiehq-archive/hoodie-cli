var Insight = require('insight');
var pkg = require('../../../package.json');
var noop = { track: function () {} };

module.exports = function () {

  var insight;

  if (!process.env.CI) {

    insight = new Insight({
      trackingCode: 'UA-53355776-2',
      packageName: pkg.name,
      packageVersion: pkg.version
    });

    insight.optOut = false;

  } else {
    insight = noop;
  }

  return insight;

};

