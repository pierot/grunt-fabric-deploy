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
    cmd = []

    # Loop operations
    for type, task of target_config
      task = [task] unless task instanceof Array
      switch type
        when 'local'
          for sub_task in task
            sub_cmd = parse_variables sub_task

            log_command type, sub_cmd

            cmd.push sub_cmd

        when 'put'
          for sub_task in task
            sub_cmd = parse_variables "scp -P {port} #{sub_task.src} {user}@{host}:#{sub_task.dest}"

            log_command type, sub_cmd

            cmd.push sub_cmd

        when 'run'
          local_cmd = ''

          for sub_task in task
            sub_cmd = parse_variables sub_task

            log_command type, sub_cmd

            local_cmd = "#{local_cmd} #{sub_cmd}; "

          if local_cmd.length > 0
            local_cmd = parse_variables "ssh -p {port} {user}@{host} '#{local_cmd}'"

          cmd.push local_cmd

        else # no operation is found, maybe grouped ..
          grunt.log.subhead "  Running #{type} group task"

          cmd.push parse_operations task[0] # get out of array

    return cmd

  # Execute commands
  execute_commands = (cmds) =>
    for cmd in cmds
      if cmd instanceof Array
        execute_commands cmd
      else
        output = exec_sync.exec cmd

        grunt.log.writeln(output.stdout) if config.options.stdout
        grunt.warn(output.stderr) if output.code != 0 && config.options.failOnError

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

    execute_commands cmd if cmd.length
