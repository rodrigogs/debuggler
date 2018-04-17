const path = require('path');
const pkgUp = require('pkg-up');

/**
 * @param {String|Boolean|Object} [name = true] A string representing debug's namespace,
 * true to get package.json name or an option object.
 *
 * @param {String|Boolean} [version = false] A string representing app's version, or true
 * to get package.json version.
 *
 * @param {String} [separator = ':'] Directory separator character.
 *
 * @return {Function}
 */
const debuggler = (name = true, version = false, separator = ':') => {
  const debugPkg = require('debug');
  const debug = debugPkg('debuggler');

  debug('configuring...');

  if (typeof name === 'object') {
    const opts = name;
    separator = opts.separator || ':';
    version = opts.version === undefined ? false : opts.version;
    name = opts.name === undefined ? true : opts.name;
  }

  const resolveName = name === true;
  const resolveVersion = version === true;

  const { filename } = module.parent;
  debug(`lib required from "${filename}"`);

  let dirname = path.dirname(filename);

  if (resolveName || resolveVersion) {
    debug('looking for parent app package.json');

    const pkgFile = pkgUp.sync(dirname);
    dirname = path.dirname(pkgFile);
    debug(`parent app package.json is located at "${pkgFile}"`);

    const pkg = require(pkgFile);
    debug(`resolved package.json for app "${pkg.name}"`);

    if (resolveVersion) version = pkg.version || '';
    if (resolveName) name = pkg.name || '';
  }

  const absolute = path.parse(filename);
  const paths = [];

  if (name) paths.push(name);
  if (version) paths.push(version);

  const dirs = absolute.dir
    .replace(dirname, '')
    .split(path.sep)
    .filter(dir => !!dir);

  paths.push(...dirs, absolute.name);

  const namespace = paths.join(separator);

  debug(`resolved namespace "${namespace}"`);

  return debugPkg(namespace);
};

module.exports = debuggler;
