/* eslint-disable padded-blocks */

const chai = require('chai');
const pkg = require('./package.json');

before(() => {
  chai.should();

  process.env.DEBUG = `debuggler,debuggler:${pkg.version}*,debuggler:test*,debuggler@test*,TEST*`;
});

describe('debuggler', () => {

  it('should not throw', async () => {
    const argsDebug = require('.')();
    const optsDebug = require('.')({});

    argsDebug('I\'m a test made with args!');
    optsDebug('I\'m a test made with options!');
  });

  it('should not throw with a custom name', async () => {
    const argsDebug = require('.')('TEST');
    const optsDebug = require('.')({ name: 'TEST' });

    argsDebug('I\'m a test made with args!');
    optsDebug('I\'m a test made with options!');
  });

  it('should not throw requiring version', async () => {
    const argsDebug = require('.')(true, true);
    const optsDebug = require('.')({ version: true });

    argsDebug('I\'m a test made with args!');
    optsDebug('I\'m a test made with options!');
  });

  it('should not throw specifying the separator', async () => {
    const argsDebug = require('.')(true, false, '@');
    const optsDebug = require('.')({ separator: '@' });

    argsDebug('I\'m a test made with args!');
    optsDebug('I\'m a test made with options!');
  });

});
