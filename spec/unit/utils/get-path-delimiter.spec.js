'use strict';

const chai = require('chai');
const expect = chai.expect;

const getPathDelimiter = require('../../../utils/get-path-delimiter');

describe('Test suite for get-path-delimiter module', () => {
  it('should return / if the path contains it only', () => {
    expect(getPathDelimiter('/some/path/')).to.be.equal('/');
  });

  it('should return \ if the path contains it only', () => {
    expect(getPathDelimiter('\\some\\path\\')).to.be.equal('\\');
  });

  it('should throw an error if the path contains both types of slashes', () => {
    expect(() => {
      getPathDelimiter('/some\\path\\');
    }).to.throw();
  });

  it('should throw an error if the path does not contain slashes', () => {
    expect(() => {
      getPathDelimiter('some slashless path');
    }).to.throw();
  });
});