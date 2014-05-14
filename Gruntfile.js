/*global module:false*/

module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    bump: {
      options: {
        commitMessage: 'chore(release): v%VERSION%',
        files: ['package.json'],
        commitFiles: [
          'package.json',
          'CHANGELOG.md'
        ],
        pushTo: 'origin master'
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

  grunt.registerTask('release', function() {

    // Forward arguments to the bump-only task
    this.args.unshift('bump-only');

    grunt.task.run([
      this.args.join(':'),
      'changelog',
      'bump-commit'
    ]);

  });

  // Default task.
  grunt.registerTask('test', ['jshint', 'simplemocha:full']);
  grunt.registerTask('default', ['test']);

};
