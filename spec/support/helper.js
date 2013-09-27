/*globals before:true, after:true*/
var sinon = require('sinon');

module.exports = {
  before: (function () {

    before(function () {
      this.sandbox = sinon.sandbox.create();
    });

  }()),
  beforeEach: (function () {

    beforeEach(function () {});

  }()),
  afterEach: (function () {

    afterEach(function () {
      this.sandbox.restore();
    });

  }()),
  after: (function () {

    after(function () {});

  }())
};

