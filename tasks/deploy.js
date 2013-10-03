(function() {
  module.exports = function(grunt) {
    var exec_sync, log_command, parse_variables,
      _this = this;
    exec_sync = require('execSync');
    parse_variables = function(variables, cmd) {
      var key, value;
      for (key in variables) {
        value = variables[key];
        cmd = cmd.replace(new RegExp("{" + key + "}", 'gi'), value);
      }
      return cmd;
    };
    log_command = function(type, command) {
      return grunt.log.writeln("[" + type + "] " + command);
    };
    return grunt.task.registerMultiTask('deploy', 'Deploy fabric-like', function() {
      var cmd, config, output, sub_cmd, sub_task, target_config, task, type, variables, _i, _j, _k, _len, _len1, _len2, _results;
      config = grunt.config(this.name);
      variables = config.options.variables;
      target_config = grunt.config([this.name, this.target]);
      grunt.log.writeln('');
      _results = [];
      for (type in target_config) {
        task = target_config[type];
        cmd = '';
        if (!(task instanceof Array)) {
          task = [task];
        }
        switch (type) {
          case 'local':
            for (_i = 0, _len = task.length; _i < _len; _i++) {
              sub_task = task[_i];
              sub_cmd = parse_variables(variables, sub_task);
              log_command(type, sub_cmd);
              cmd = "" + cmd + " " + sub_cmd + "; ";
            }
            break;
          case 'put':
            for (_j = 0, _len1 = task.length; _j < _len1; _j++) {
              sub_task = task[_j];
              sub_cmd = parse_variables(variables, "scp -P {port} " + sub_task.src + " {user}@{host}:" + sub_task.dest);
              log_command(type, sub_cmd);
              cmd = "" + cmd + " " + sub_cmd + "; ";
            }
            break;
          case 'run':
            for (_k = 0, _len2 = task.length; _k < _len2; _k++) {
              sub_task = task[_k];
              sub_cmd = parse_variables(variables, sub_task);
              log_command(type, sub_cmd);
              cmd = "" + cmd + " " + sub_cmd + "; ";
            }
            if (cmd.length > 0) {
              cmd = parse_variables(variables, "ssh -p {port} {user}@{host} '" + cmd + "'");
            }
        }
        if (cmd.length) {
          output = exec_sync.exec(cmd);
          if (config.options.stdout) {
            grunt.log.writeln(output.stdout);
          }
          if (config.options.failOnError) {
            if (output.code !== 0) {
              _results.push(grunt.warn(output.stderr));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

}).call(this);
