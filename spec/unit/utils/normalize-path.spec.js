'use strict';

const chai = require('chai');
const expect = chai.expect;

const normalizePath = require('../../../utils/normalize-path');

const path = 'path/to/somewhere';

describe('Test suite for normalize-path module', () => {
  it('should add slashes at the beginning and at the end of path, if necessary', () => {
    expect(normalizePath(path)).to.be.equal(`/${path}/`);
  });

  it('should not add slashes at the beginning and at the end of path, if there are.', () => {
    expect(normalizePath(path)).not.to.be.equal(`//${path}//`);
  });

  it('should replace double slashes with one', () => {
    const path = 'path//to//somewhere';

    expect(normalizePath(path)).to.be.equal('/path/to/somewhere/');
  });

  it('should replace triple slashes with one', () => {
    const path = 'path//to///somewhere///';

    expect(normalizePath(path)).to.be.equal('/path/to/somewhere/');
  });
});