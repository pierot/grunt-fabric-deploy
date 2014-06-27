# Options

## stdout
Type: `Boolean` `false`
Default: `'false'`

Boolean switch for showing the output of each command.

### Example:

```js
options: {
  stdout: true
}
```

## failOnError
Type: `Boolean` `false`
Default: `'false'`

Boolean switch for failing on an error.

### Example:

```js
options: {
  failOnError: true
}
```

## variables
Type: `Object`

Object with variables that can be used in each command.
Variables in a string are placed in brackets `{}`.
This object can be on task level as well (see examples).

### Example:

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
