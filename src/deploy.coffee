# grunt-fabric-deploy
# http://noort.be/
#
# Copyright (c) 2013 Pieter Michels, contributors
# Licensed under the MIT license.

module.exports = (grunt) ->

  exec_sync = require('execSync')

  # Loop all available variables and replace
  parse_variables = (variables, cmd) =>
    for key, value of variables
      cmd = cmd.replace new RegExp("{#{key}}", 'gi'), value

    return cmd

  # Logger
  log_command = (type, command) =>
    grunt.log.writeln "[#{type}] #{command}"

  # Register multi task
  grunt.task.registerMultiTask 'deploy', 'Deploy fabric-like', () ->
    config = grunt.config this.name
    variables = config.options.variables
    target_config = grunt.config [this.name, this.target]

    grunt.log.writeln ''

    # Loop tasks
    for type, task of target_config
      cmd = ''
      task = [task] unless task instanceof Array

      switch type
        when 'local'
          for sub_task in task
            sub_cmd = parse_variables variables, sub_task

            log_command type, sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

        when 'put'
          for sub_task in task
            sub_cmd = parse_variables variables, "scp -P {port} #{sub_task.src} {user}@{host}:#{sub_task.dest}"

            log_command type, sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

        when 'run'
          for sub_task in task
            sub_cmd = parse_variables variables, sub_task

            log_command type, sub_cmd

            cmd = "#{cmd} #{sub_cmd}; "

          if cmd.length > 0
            cmd = parse_variables variables, "ssh -p {port} {user}@{host} '#{cmd}'"

      if cmd.length
        output = exec_sync.exec cmd

        grunt.log.writeln(output.stdout) if config.options.stdout

        if config.options.failOnError
          grunt.warn(output.stderr) if output.code != 0

      # grunt.log.writeln ''
