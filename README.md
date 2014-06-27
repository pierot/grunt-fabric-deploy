# grunt-fabric-deploy v0.0.5

> Provides Fabric (python) like deploy tasks



## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fabric-deploy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fabric-deploy');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4).




## Deploy task
_Run this task with the `grunt deploy` command._

### Task operations

#### local
Executes given commands in the local shell.

##### Examples:

```js
task_one:
  local: ''
```

Operations defined as array:

```js
task_one:
  local: [
    '',
    ''
  ]
```

#### put
Puts file(s) on a remote server via scp.

##### Requirements:
You need to provide `host`, `user` and `port` for the ssh connection.

##### Examples:

```js
options: {
  variables: {
    host: 'server.com',
    user: 'user',
    port: '22'
  }
},
task_one: {
  put: {
    src: '/tmp/file.zip', // local path
    dest: '/tmp/file.zip' // path on remote server
  }
}
```

Operations defined as array:

```js
options: {
  variables: {
    host: 'server.com',
    user: 'user',
    port: '22'
  }
},
task_one: {
  put: [
    {
      src: '/tmp/file.zip',
      dest: '/tmp/file.zip'
    },
    {
      src: '/tmp/file.zip',
      dest: '/tmp/file.zip'
    }
  ]
}
```

#### run
Executes given commands on the remote server.

##### Requirements:
You need to provide `host`, `user` and `port` for the ssh connection.

##### Examples:

```js
options: {
  variables: {
    host: 'server.com',
    user: 'user',
    port: '22'
  }
},
task_one: {
  run: 'cat /tmp/file.txt'
}
```

Operations defined as array:

```js
options: {
  variables: {
    host: 'server.com',
    user: 'user',
    port: '22'
  }
},
task_one: {
  run: [
    'echo "test" > /tmp/file.txt',
    'cat /tmp/file.txt'
  ]
}
```

### Task Grouping

You can group tasks to define tasks and subtasks.

##### Examples:

```js
staging: {
  pack: {
    local: 'touch /tmp/file.txt'
  },
  upload: {
    put: {
      src: '/tmp/file.txt',
      dest: '/tmp/file.txt'
    }
    run: 'cat /tmp/file.txt'
  }
}
production: {
  pack: {
    local: 'touch /tmp/live-file.txt'
  },
  upload: {
    put: {
      src: '/tmp/live-file.txt',
      dest: '/tmp/live-file.txt'
    }
    run: [
      'cat /tmp/live-file.txt',
      'mv /tmp/live-file.txt /www/server.com/public/index.html'
    ]
  }
}
```

You can call the groups separately: `grunt deploy:staging` or `grunt deploy:production`.

### Options

#### stdout
Type: `Boolean` `false`
Default: `'false'`

Boolean switch for showing the output of each command.

##### Example:

```js
options: {
  stdout: true
}
```

#### failOnError
Type: `Boolean` `false`
Default: `'false'`

Boolean switch for failing on an error.

##### Example:

```js
options: {
  failOnError: true
}
```

#### variables
Type: `Object`

Object with variables that can be used in each command.
Variables in a string are placed in brackets `{}`.
This object can be on task level as well (see examples).

##### Example:

```js
options: {
  variables: {
    var_a: 'test'
  }
}
task_one: {
  local: 'echo "{var_a}"'
}
```

### Usage Examples

```js
deploy: {
  options: {
    variables: {
      packed: 'filename'
      host: 'server.com',
      port: 22,
      user: 'deploy_user'
    }
  },
  pack: {
    local: '/usr/bin/gnutar -zcf /tmp/{packed}.tar.gz -C ./ .'
  },
  staging: {
    put: {
      src: '/tmp/{packed}.tar.gz',
      dest: '/tmp/{packed}.tar.gz'
    },
    run: [
      'rm -rf /tmp/{packed}',
      'mkdir -p /tmp/{packed}',
      'tar -zxf /tmp/{packed}.tar.gz -C /tmp/{packed}',

      'rm -rf /srv/www/server.com/public',
      'mkdir -p /srv/www/server.com/public',
      'mv /tmp/{packed}/* /srv/www/server.com/public/'
    ]
  },
  production: {
    variables: {
      host: 'server-production.com'
    }
    put: {
      src: '/tmp/{packed}.tar.gz',
      dest: '/tmp/{packed}.tar.gz'
    },
    run: [
      'echo $PATH'
    ]
  }
}
```



## Release History

 * 2014-06-27   v0.0.5   Removing console.log references
 * 2014-06-27   v0.0.4   Variables on task level, merged into global variables
 * 2013-10-03   v0.0.3   Better docs Refactor Grouping
 * 2013-10-03   v0.0.2   Added stdout + failOnError options
 * 2013-10-02   v0.0.1   Initial version

---

Task submitted by [Pieter Michels](http://noort.be/)

*This file was generated on Fri Jun 27 2014 16:53:38.*
