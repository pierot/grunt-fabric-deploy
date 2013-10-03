# grunt-fabric-deploy
# http://noort.be/
#
# Copyright (c) 2013 Pieter Michels, contributors
# Licensed under the MIT license.

module.exports = (grunt) ->

  exec_sync = require('execSync')

  variables = null
  config = null

  # Loop all available variables and replace
  parse_variables = (cmd) =>
    for key, value of variables
      cmd = cmd.replace new RegExp("{#{key}}", 'gi'), value

    return cmd

  parse_operations = (target_config) =>
    # Loop operations
    for type, task of target_config
      cmd = ''
      task = [task] unless task instanceof Array

      switch type
        when 'local'
          for sub_task in task
            sub_cmd = parse_variables sub_task

            log_command type, sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

        when 'put'
          for sub_task in task
            sub_cmd = parse_variables "scp -P {port} #{sub_task.src} {user}@{host}:#{sub_task.dest}"

            log_command type, sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

        when 'run'
          for sub_task in task
            sub_cmd = parse_variables sub_task

            log_command type, sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

          if cmd.length > 0
            cmd = parse_variables "ssh -p {port} {user}@{host} '#{cmd}'"

        else # no operation is found, maybe grouped ..
          grunt.log.subhead "Running #{type} group task"

          cmd = parse_operations task[0] # get out of array

    return cmd

  # Logger
  log_command = (type, command) =>
    grunt.log.writeln "  [#{type}] #{command}"

  # Register multi task
  grunt.task.registerMultiTask 'deploy', 'Deploy fabric-like', () ->
    # Parent defined
    config = grunt.config this.name
    variables = config.options.variables

    grunt.log.writeln ''

    cmd = parse_operations grunt.config([this.name, this.target])

    if cmd.length
      output = exec_sync.exec cmd

      grunt.log.writeln(output.stdout) if config.options.stdout

      if config.options.failOnError
        grunt.warn(output.stderr) if output.code != 0
