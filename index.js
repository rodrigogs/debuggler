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
const setDefaultOptions = options => Object.assign({}, {
  namespace: undefined,
  name: true,
  version: false,
  verSeparator: '@',
  dirSeparator: ':',
  file: true,
  ext: false,
}, options);

const resolveVersion = (option, pkg) => (option === true
  ? pkg.version
  : (option || ''));

const resolveName = (option, pkg) => (option === true
  ? pkg.name
  : (option || ''));

const resolveDirs = (dir, options) => dir
  .replace(options.dirname, '')
  .split(path.sep)
  .filter(dir => !!dir)
  .join(options.dirSeparator);

const resolveFile = (option, fileName) => (option === true
  ? fileName
  : (option || ''));

const resolveExt = (option, ext) => (option === true
  ? ext
  : (option || ''));

/**
 * @param {Object} options
 * @param {Object} pkg
 * @return {String}
 */
const buildNamespace = (options, pkg) => {
  const absolute = path.parse(options.filename);
  const paths = [];

  const version = resolveVersion(options.version, pkg);
  const name = resolveName(options.name, pkg);
  const dirs = resolveDirs(absolute.dir, options);
  const file = resolveFile(options.file, absolute.name);
  const ext = resolveExt(options.ext, absolute.ext);

  if (version && name) {
    paths.push(`${name}${options.verSeparator}${version}`);
  } else if (name) {
    paths.push(name);
  }

  if (dirs) paths.push(dirs);

  if (file && ext) {
    paths.push(`${file}${ext}`);
  } else if (file) {
    paths.push(file);
  }

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
  if (isString(options) || (options && options.namespace)) {
    debug('namespace only, falling back to debug module');
    return debugPkg(options.namespace || options);
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
