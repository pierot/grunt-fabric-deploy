(function() {
  module.exports = function(grunt) {
    var config, exec, execute_command, execute_commands, log_command, parse_operations, parse_variables, variables_global, _,
      _this = this;
    exec = require('sync-exec');
    _ = require('lodash');
    variables_global = null;
    config = null;
    parse_variables = function(variables, cmd) {
      var key, value;
      for (key in variables) {
        value = variables[key];
        cmd = cmd.replace(new RegExp("{" + key + "}", 'gi'), value);
      }
      return cmd;
    };
    parse_operations = function(target_config) {
      var cmd, local_cmd, sub_cmd, sub_task, task, type, variables, _i, _j, _k, _len, _len1, _len2;
      cmd = [];
      variables = variables_global;
      if (target_config.variables != null) {
        _.merge(variables, target_config.variables);
      }
      for (type in target_config) {
        task = target_config[type];
        if (!(task instanceof Array)) {
          task = [task];
        }
        switch (type) {
          case 'local':
            for (_i = 0, _len = task.length; _i < _len; _i++) {
              sub_task = task[_i];
              sub_cmd = parse_variables(variables, sub_task);
              log_command(type, sub_cmd);
              cmd.push(sub_cmd);
            }
            break;
          case 'put':
            for (_j = 0, _len1 = task.length; _j < _len1; _j++) {
              sub_task = task[_j];
              sub_cmd = parse_variables(variables, "scp -P {port} " + sub_task.src + " {user}@{host}:" + sub_task.dest);
              log_command(type, sub_cmd);
              cmd.push(sub_cmd);
            }
            break;
          case 'run':
            local_cmd = '';
            for (_k = 0, _len2 = task.length; _k < _len2; _k++) {
              sub_task = task[_k];
              sub_cmd = parse_variables(variables, sub_task);
              log_command(type, sub_cmd);
              local_cmd = "" + local_cmd + " " + sub_cmd + "; ";
            }
            if (local_cmd.length > 0) {
              local_cmd = parse_variables(variables, "ssh -p {port} {user}@{host} '" + local_cmd + "'");
            }
            cmd.push(local_cmd);
            break;
          case 'variables':
            break;
          default:
            grunt.log.subhead("  Running " + type + " group task");
            cmd.push(parse_operations(task[0]));
        }
      }
      return cmd;
    };
    execute_commands = function(cmds) {
      var cmd, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cmds.length; _i < _len; _i++) {
        cmd = cmds[_i];
        if (cmd instanceof Array) {
          _results.push(execute_commands(cmd));
        } else {
          _results.push(execute_command(cmd));
        }
      }
      return _results;
    };
    execute_command = function(cmd) {
      var output;
      output = exec(cmd);
      if (config.options.stdout) {
        grunt.log.writeln(output.stdout);
      }
      if (output.status !== 0 && config.options.failOnError) {
        return grunt.log.errorlns(output.stderr);
      }
    };
    log_command = function(type, command) {
      return grunt.log.writeln("  [" + type + "] " + command);
    };
    return grunt.task.registerMultiTask('deploy', 'Deploy fabric-like', function() {
      var cmd;
      config = grunt.config(this.name);
      variables_global = config.options.variables;
      grunt.log.writeln('');
      cmd = parse_operations(grunt.config([this.name, this.target]));
      if (cmd.length) {
        return execute_commands(cmd);
      }
    });
  };

}).call(this);
