/*global module:false*/

module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    release: {
      options: {
        bump: {
          files: ['package.json'],
          commitFiles: [
            'package.json',
            'CHANGELOG.md'
          ]
        }
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'bin/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    simplemocha: {
      options: {
        reporter: 'spec',
        node_env: 'testing',
        ignoreLeaks: true
      },
      full: { src: ['spec/runner.js'] }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: 'jshint'
    }

  });

  // Default task.
  grunt.registerTask('test', ['jshint', 'simplemocha:full']);
  grunt.registerTask('ci', ['test', 'integration-test']);
  grunt.registerTask('default', ['test']);
};
