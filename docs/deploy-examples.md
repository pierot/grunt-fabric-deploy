# Usage Examples

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
  upload: {
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
  }
}
```

