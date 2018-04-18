/* eslint-disable padded-blocks */

const { stdout } = require('test-console');
const chai = require('chai');
const pkg = require('./package.json');

before(() => {
  chai.should();
  process.env.DEBUG = `${pkg.name}*test*,TEST*`;
});

describe('debuggler', () => {

  it('should parse namespace using args and opts', () => {
    const argsDebug = require('.')();
    const optsDebug = require('.')({});

    argsDebug.log = console.log.bind(console);
    optsDebug.log = console.log.bind(console);

    const argsOutput = stdout.inspectSync(() => {
      argsDebug('I\'m a test made with args!');
    });

    argsOutput.should.be.an('array').to.have.length(1);
    argsOutput[0].should.be.a('string').that.includes(`${pkg.name}:test`);

    const optsOutput = stdout.inspectSync(() => {
      optsDebug('I\'m a test made with args!');
    });

    optsOutput.should.be.an('array').to.have.length(1);
    optsOutput[0].should.be.a('string').that.includes(`${pkg.name}:test`);
  });

  it('should parse with a custom namespace using args and opts', () => {
    const argsDebug = require('.')('TEST');
    const optsDebug = require('.')({ namespace: 'TEST' });

    argsDebug.log = console.log.bind(console);
    optsDebug.log = console.log.bind(console);

    const argsOutput = stdout.inspectSync(() => {
      argsDebug('I\'m a test made with args!');
    });

    argsOutput.should.be.an('array').to.have.length(1);
    argsOutput[0].should.be.a('string').that.includes('TEST');

    const optsOutput = stdout.inspectSync(() => {
      optsDebug('I\'m a test made with args!');
    });

    optsOutput.should.be.an('array').to.have.length(1);
    optsOutput[0].should.be.a('string').that.includes('TEST');
  });

  it('should parse namespace requiring version', () => {
    const debug = require('.')({ version: true });

    debug.log = console.log.bind(console);

    const output = stdout.inspectSync(() => {
      debug('I\'m a test made with args!');
    });

    output.should.be.an('array').to.have.length(1);
    output[0].should.be.a('string').that.includes(`${pkg.name}@${pkg.version}:test`);
  });

  it('should parse namespace with a custom version', () => {
    const debug = require('.')({ version: 'test' });

    debug.log = console.log.bind(console);

    const output = stdout.inspectSync(() => {
      debug('I\'m a test made with args!');
    });

    output.should.be.an('array').to.have.length(1);
    output[0].should.be.a('string').that.includes(`${pkg.name}@test:test`);
  });

  it('should parse namespace with a custom the separator', () => {
    const debug = require('.')({ verSeparator: '?', version: true });

    debug.log = console.log.bind(console);

    const output = stdout.inspectSync(() => {
      debug('I\'m a test made with args!');
    });

    output.should.be.an('array').to.have.length(1);
    output[0].should.be.a('string').that.includes(`${pkg.name}?${pkg.version}:test`);
  });

  it('should parse namespace without file name', () => {
    const debug = require('.')({ name: 'TEST', file: false });

    debug.log = console.log.bind(console);

    const output = stdout.inspectSync(() => {
      debug('I\'m a test made with args!');
    });

    output.should.be.an('array').to.have.length(1);
    output[0].should.be.a('string').that.includes('TEST');
  });

  it('should parse namespace with file extension', () => {
    const debug = require('.')({ ext: true });

    debug.log = console.log.bind(console);

    const output = stdout.inspectSync(() => {
      debug('I\'m a test made with args!');
    });

    output.should.be.an('array').to.have.length(1);
    output[0].should.be.a('string').that.includes(`${pkg.name}:test.js`);
  });

});
