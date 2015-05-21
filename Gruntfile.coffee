# grunt-contrib-deploy
# http://noort.be/
#
# Copyright (c) 2015 Pieter Michels, contributors
# Licensed under the MIT license.

module.exports = (grunt) ->
  pkg: grunt.file.readJSON('package.json')

  grunt.initConfig
    coffee:
      app:
        files: [
            expand: true
            preserve_dirs: true
            bare: false
            cwd: 'src/'
            src: ['**/*.coffee']
            dest: 'tasks'
            ext: '.js'
          ]

  # Actually load this plugin's task(s).
  grunt.loadTasks "tasks"

  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  # By default, lint and run all tests.
  grunt.registerTask "default", ["coffee", "build-contrib"]
