# Task operations

## local
Executes given commands in the local shell.

### Examples:

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

## put
Puts file(s) on a remote server via scp.

### Requirements:
You need to provide `host`, `user` and `port` for the ssh connection.

### Examples:

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

## run
Executes given commands on the remote server.

### Requirements:
You need to provide `host`, `user` and `port` for the ssh connection.

### Examples:

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

# Task Grouping

You can group tasks to define tasks and subtasks.

### Examples:

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
