var Insight = require('insight');
var pkg = require('../../../package.json');

module.exports = function () {

  var trackingCode = 'UA-53355776-2';

  if (process.env.CI) {
    trackingCode = '';
  }

  var insight = new Insight({
    trackingCode: trackingCode,
    packageName: pkg.name,
    packageVersion: pkg.version
  });

  insight.optOut = false;


  return insight;

};

