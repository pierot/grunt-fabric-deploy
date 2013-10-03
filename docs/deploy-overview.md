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
