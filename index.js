// caller-path only works using strict mode

'use strict';

const path = require('path');
const pkgUp = require('pkg-up');
const callerPath = require('caller-path');

/**
 * @param {String} what
 * @return {Boolean}
 */
const isString = (what) => {
  return typeof what === 'string';
};

/**
 * @param {Object} options
 * @return {Object}
 */
const setDefaultOptions = options => Object.assign({}, options, {
  namespace: undefined,
  name: true,
  version: false,
  verSeparator: '@',
  dirSeparator: ':',
  file: true,
  ext: false,
});

/**
 * @param {Object} options
 * @param {Object} pkg
 * @return {String}
 */
const buildNamespace = (options, pkg) => {
  const absolute = path.parse(options.filename);
  const paths = [];

  options.version = options.version === true
    ? pkg.version
    : (options.version || '');

  options.name = options.name === true ? pkg.name : (options.name || '');
  options.name = options.version
    ? `${options.name}${options.verSeparator}${options.version}`
    : options.name;

  options.dirs = absolute.dir
    .replace(options.dirname, '')
    .split(path.sep)
    .filter(dir => !!dir)
    .join(options.dirSeparator);

  options.file = options.file === true ? absolute.name : (options.file || '');
  options.ext = options.ext === true ? absolute.ext : (options.ext || '');

  if (options.name) paths.push(options.name);
  if (options.dirs) paths.push(...options.dirs);
  if (options.file) paths.push(options.file);
  if (options.ext) paths.push(options.ext);

  return paths.join(options.dirSeparator);
};

/**
 * debuggler is a visionmedia/debug wrapper that is able to resolves it's caller path and package.json information,
 * so it needs no configuration.
 *
 * @example
 * // /home/example/package.json
 * //   name: example
 * //   version: 1.0.0
 * // /home/example/foo/bar.js
 * process.env.DEBUG = 'example*';
 *
 * const debug = require('debuggler')({ version: true });
 *
 * debug('I know where I am!');
 * // Should output: example@1.0.0:foo:bar I know where I am!
 *
 * @param {String|Object}   [options]                     Debug namespace string or an options object.
 * @param {String}          [options.namespace]           Namespace is just passed to debug module, other options are ignored.
 * @param {String}          [options.name = true]         Project name or true to get it from package.json.
 * @param {String|Boolean}  [options.version = false]     Version string or true to get it from package.json.
 * @param {String}          [options.verSeparator = '@']  Version separator character.
 * @param {String}          [options.dirSeparator = ':']  Directory separator character.
 * @param {String|Boolean}  [options.file = true]         File name or true to get the current one.
 * @param {String|Boolean}  [options.ext = false]         File extension or true to get the current one.
 *
 * @return {Function}
 */
const debuggler = (options) => {
  const debugPkg = require('debug');
  const debug = debugPkg('debuggler');

  debug('configuring');
  if (isString(options)) {
    debug('namespace only, falling back to debug module');
    return debugPkg(options);
  }

  options = setDefaultOptions(options);

  const filename = callerPath();
  debug(`lib required from "${filename}"`);

  let dirname = path.dirname(filename);

  debug('looking for parent app package.json');
  const pkgFile = pkgUp.sync(dirname);
  dirname = path.dirname(pkgFile);
  debug(`parent app package.json is located at "${pkgFile}"`);

  const pkg = require(pkgFile);

  options.dirname = dirname;
  options.filename = filename;

  const namespace = buildNamespace(options, pkg);

  debug(`resolved namespace "${namespace}"`);

  return debugPkg(namespace);
};

module.exports = debuggler;
