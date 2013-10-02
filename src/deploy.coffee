# grunt-fabric-deploy
# http://noort.be/
#
# Copyright (c) 2013 Pieter Michels, contributors
# Licensed under the MIT license.

module.exports = (grunt) ->

  exec_sync = require('execSync')

  parse_cmd = (variables, cmd) =>
    for key, value of variables
      cmd = cmd.replace new RegExp("{#{key}}", 'gi'), value

    return cmd

  grunt.task.registerMultiTask 'deploy', 'Deploy fabric-like', () ->
    config = grunt.config this.name
    variables = config.options.variables
    cfg = grunt.config [this.name, this.target]

    grunt.log.writeln ''

    for cmd_name, cmd_task of cfg
      cmd = ''

      switch cmd_name
        when 'local'
          cmd = parse_cmd variables, cmd_task

          grunt.log.writeln '[local] ' + cmd

        when 'put'
          cmd = parse_cmd variables, "scp -P {port} #{cmd_task.src} {user}@{host}:#{cmd_task.dest}"

          grunt.log.writeln '[put] ' + cmd

        when 'run'
          for sub_cmd in cmd_task
            sub_cmd = parse_cmd variables, sub_cmd

            grunt.log.writeln '[run] ' + sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

          if cmd.length > 0
            cmd = parse_cmd variables, "ssh -p {port} {user}@{host} '#{cmd}'"

      exec_sync.run cmd if cmd.length

    grunt.log.writeln ''

