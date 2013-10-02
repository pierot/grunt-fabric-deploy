(function() {
  module.exports = function(grunt) {
    var exec_sync, parse_cmd,
      _this = this;
    exec_sync = require('execSync');
    parse_cmd = function(variables, cmd) {
      var key, value;
      for (key in variables) {
        value = variables[key];
        cmd = cmd.replace(new RegExp("{" + key + "}", 'gi'), value);
      }
      return cmd;
    };
    return grunt.task.registerMultiTask('deploy', 'Deploy fabric-like', function() {
      var cfg, cmd, cmd_name, cmd_task, config, sub_cmd, variables, _i, _len;
      config = grunt.config(this.name);
      variables = config.options.variables;
      cfg = grunt.config([this.name, this.target]);
      grunt.log.writeln('');
      for (cmd_name in cfg) {
        cmd_task = cfg[cmd_name];
        cmd = '';
        switch (cmd_name) {
          case 'local':
            cmd = parse_cmd(variables, cmd_task);
            grunt.log.writeln('[local] ' + cmd);
            break;
          case 'put':
            cmd = parse_cmd(variables, "scp -P {port} " + cmd_task.src + " {user}@{host}:" + cmd_task.dest);
            grunt.log.writeln('[put] ' + cmd);
            break;
          case 'run':
            for (_i = 0, _len = cmd_task.length; _i < _len; _i++) {
              sub_cmd = cmd_task[_i];
              sub_cmd = parse_cmd(variables, sub_cmd);
              grunt.log.writeln('[run] ' + sub_cmd);
              cmd = "" + cmd + " " + sub_cmd + "; ";
            }
            if (cmd.length > 0) {
              cmd = parse_cmd(variables, "ssh -p {port} {user}@{host} '" + cmd + "'");
            }
        }
        if (cmd.length) {
          exec_sync.run(cmd);
        }
      }
      return grunt.log.writeln('');
    });
  };

}).call(this);
