var updateNotifier = require('update-notifier');

module.exports = function() {

  var notifier = updateNotifier({
    packagePath: '../../../package',
    updateCheckInterval: 1000 * 60 * 60 * 24 // 1 day
  });


  if (notifier.update) {
    notifier.notify(true);
  }

};
