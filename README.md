# grunt-fabric-deploy v0.0.1

> Provides Fabric (python) like deploy tasks



## Getting Started
This plugin requires Grunt `~0.4.0`

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


### Options

#### stdout
Type: `Boolean` `false`
Default: `'false'`

Boolean switch for showing the output of each command.

Example:
```js
options: {
  stdout: true
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



## Release History

 * 2013-10-03   v0.0.2   Added stdout + failOnError options
 * 2013-10-02   v0.0.1   Initial version

---

Task submitted by [Pieter Michels](http://noort.be/)

*This file was generated on Thu Oct 03 2013 10:12:29.*
