var cp = require('child_process')
var writeFileSync = require('fs').writeFileSync
var path = require('path')

var nixt = require('nixt')
var expect = require('expect.js')

var cwd = path.resolve('./.tmp')
var hoodieCwd = path.join(cwd, 'test')

process.env.HOODIE_SETUP_PASSWORD = '12345'

function hoodieStart (args, regex, cb) {
  var start = cp.spawn('../../bin/hoodie', ['start', '-n'].concat(args), {
    cwd: hoodieCwd,
    detached: true
  })
  var timeoutError = null;
  var killStart = process.kill.bind(process, -start.pid)
  var killTimeout = setTimeout(function () {
    timeoutError = new Error('timeout')
    killStart()
  }, 50000)
  start.stdout.on('data', function (data) {
    if (regex.test(data.toString())) {
      clearTimeout(killTimeout)
      killStart()
    }
  })
  start.on('close', function (code) {
    cb(timeoutError)
  })
}

describe('hoodie integration tests', function () {
  this.timeout(100000)

  before(function (done) {
    cp.exec('(rm -rf .tmp || true) && mkdir .tmp', done)
  })

  describe('hoodie help', function () {
    it('should output the usage information', function (done) {
      nixt()
      .cwd(cwd)
      .run('../bin/hoodie help')
      .stdout(/Usage/)
      .end(done)
    })
  })

  describe('hoodie new', function () {
    it('should create the app', function (done) {
      nixt()
      .cwd(cwd)
      .run('../bin/hoodie new test')
      .stdout(/You can now start using your hoodie app/)
      .end(done)
    })
  })

  describe('hoodie start', function () {
    it('should start the app', function (done) {
      hoodieStart([], /All plugins started\./, done)
    })

    it('should start the app after a crash', function (done) {
      writeFileSync(path.join(hoodieCwd, 'data/hoodie.pid'), '12345')
      hoodieStart([], /Hoodie is already running!/, done)
    })

    it('should start the app in force mode after a crash', function (done) {
      writeFileSync(path.join(hoodieCwd, 'data/hoodie.pid'), '12345')
      hoodieStart(['-f'], /All plugins started\./, done)
    })
  })
})
