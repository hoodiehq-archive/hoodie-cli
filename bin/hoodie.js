#!/usr/bin/env node

var CLI = require('../lib/cli'),
    argv = require('optimist').argv;

var cli = new CLI().argv(argv);
