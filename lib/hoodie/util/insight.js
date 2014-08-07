var Insight = require('insight');
var pkg = require('../../../package.json');

module.exports = function () {

  var trackingCode;

  if (!process.env.CI) {
    trackingCode = 'UA-53355776-2';
  } else {
    trackingCode = 'UA-00000000-0';
  }

  var insight = new Insight({
    trackingCode: trackingCode,
    packageName: pkg.name,
    packageVersion: pkg.version
  });

  insight.optOut = false;


  return insight;

};

