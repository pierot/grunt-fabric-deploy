(function() {
  module.exports = function(grunt) {
    var config, exec_sync, execute_commands, log_command, parse_operations, parse_variables, variables,
      _this = this;
    exec_sync = require('execSync');
    variables = null;
    config = null;
    parse_variables = function(cmd) {
      var key, value;
      for (key in variables) {
        value = variables[key];
        cmd = cmd.replace(new RegExp("{" + key + "}", 'gi'), value);
      }
      return cmd;
    };
    parse_operations = function(target_config) {
      var cmd, local_cmd, sub_cmd, sub_task, task, type, _i, _j, _k, _len, _len1, _len2;
      cmd = [];
      for (type in target_config) {
        task = target_config[type];
        if (!(task instanceof Array)) {
          task = [task];
        }
        switch (type) {
          case 'local':
            for (_i = 0, _len = task.length; _i < _len; _i++) {
              sub_task = task[_i];
              sub_cmd = parse_variables(sub_task);
              log_command(type, sub_cmd);
              cmd.push(sub_cmd);
            }
            break;
          case 'put':
            for (_j = 0, _len1 = task.length; _j < _len1; _j++) {
              sub_task = task[_j];
              sub_cmd = parse_variables("scp -P {port} " + sub_task.src + " {user}@{host}:" + sub_task.dest);
              log_command(type, sub_cmd);
              cmd.push(sub_cmd);
            }
            break;
          case 'run':
            local_cmd = '';
            for (_k = 0, _len2 = task.length; _k < _len2; _k++) {
              sub_task = task[_k];
              sub_cmd = parse_variables(sub_task);
              log_command(type, sub_cmd);
              local_cmd = "" + local_cmd + " " + sub_cmd + "; ";
            }
            if (local_cmd.length > 0) {
              local_cmd = parse_variables("ssh -p {port} {user}@{host} '" + local_cmd + "'");
            }
            cmd.push(local_cmd);
            break;
          default:
            grunt.log.subhead("Running " + type + " group task");
            cmd.push(parse_operations(task[0]));
        }
      }
      return cmd;
    };
    execute_commands = function(cmds) {
      var cmd, output, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cmds.length; _i < _len; _i++) {
        cmd = cmds[_i];
        if (cmd instanceof Array) {
          _results.push(execute_commands(cmd));
        } else {
          output = exec_sync.exec(cmd);
          if (config.options.stdout) {
            grunt.log.writeln(output.stdout);
          }
          if (output.code !== 0 && config.options.failOnError) {
            _results.push(grunt.warn(output.stderr));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    };
    log_command = function(type, command) {
      return grunt.log.writeln("  [" + type + "] " + command);
    };
    return grunt.task.registerMultiTask('deploy', 'Deploy fabric-like', function() {
      var cmd;
      config = grunt.config(this.name);
      variables = config.options.variables;
      grunt.log.writeln('');
      cmd = parse_operations(grunt.config([this.name, this.target]));
      if (cmd.length) {
        return execute_commands(cmd);
      }
    });
  };

}).call(this);
