# debuggler

[![Build Status](https://travis-ci.org/rodrigogs/debuggler.svg?branch=master)](https://travis-ci.org/rodrigogs/debuggler)
[![Code Climate](https://codeclimate.com/github/rodrigogs/debuggler/badges/gpa.svg)](https://codeclimate.com/github/rodrigogs/debuggler)
[![Test Coverage](https://codeclimate.com/github/rodrigogs/debuggler/badges/coverage.svg)](https://codeclimate.com/github/rodrigogs/debuggler/coverage)

**debuggler** is a [visionmedia/debug](https://github.com/visionmedia/debug) wrapper that is able to resolves it's caller path and package.json information,
so it needs no configuration.

### Install
```bash
$ npm install debuggler
```

### Usage
```javascript
/**
 * /home/example/package.json 
 *   name: example
 *   version: 1.0.0
 * /home/example/foo/bar.js
 */
process.env.DEBUG = 'example*';

const debug = require('debuggler')({ version: true });

debug('I know where I am!');
// Should output: example@1.0.0:foo:bar I know where I am!
```

### API
| Argument               | Type            | Default Value | Description                                                          |
|------------------------|-----------------|---------------|----------------------------------------------------------------------|
| options                | String\|Object  | `{}`          | Debug namespace string or an options object.                         |
| options.namespace      | String          | `undefined`   | Namespace is just passed to debug module, other options are ignored. |
| options.name           | String          | `true`        | Project name or true to get it from package.json.                    |
| options.version        | String\|Boolean | `false`       | Version string or true to get it from package.json.                  |
| options.verSeparator   | String          | `'@'`         | Version separator character.                                         |
| options.dirSeparator   | String          | `':'`         | Directory separator character.                                       |
| options.file           | String\|Boolean | `true`        | File name or true to get the current one.                            |
| options.ext            | String\|Boolean | `false`       | File extension or true to get the current one.                       |

### License
[Licence](https://github.com/rodrigogs/debuggler/blob/master/LICENSE) © Rodrigo Gomes da Silva
