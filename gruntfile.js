'use strict';

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js: {
        files: ['gruntfile.js', 'app.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js'],
        tasks: ['jshint']
      },
      html: {
        files: ['public/views/**']
      },
      css: {
        files: ['public/css/**']
      }
    },

    jshint: {
      all: {
        src: ['gruntfile.js', 'app.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**', 'test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['public/**'],
          watchedExtensions: ['js'],
          nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['jshint', 'concurrent']);
};