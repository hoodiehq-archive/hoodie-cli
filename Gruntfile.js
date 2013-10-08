/*global module:false*/

module.exports = function (grunt) {

  "use strict";

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');


  // Project configuration.
  grunt.initConfig({

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
  grunt.registerTask('default', ['jshint', 'simplemocha:full']);
  grunt.registerTask('test', ['jshint', 'simplemocha:full']);

};
