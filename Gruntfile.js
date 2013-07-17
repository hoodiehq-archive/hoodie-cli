/*global module:false*/

module.exports = function (grunt) {

  "use strict";

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

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

    watch: {
      files: ['<config:jshint.files>'],
      tasks: 'jshint'
    }

  });

  // Default task.
  grunt.registerTask('default', 'jshint');

};
