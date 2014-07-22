var updateNotifier = require('update-notifier');
var pkg = require('../../../package.json');

module.exports = function() {

  var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version,
    packagePath: '../../../package',
    updateCheckInterval: 1000 * 60 * 60 * 1 // 1 hr
  });

  if (notifier.update) {
    notifier.notify(true);
  }

};
