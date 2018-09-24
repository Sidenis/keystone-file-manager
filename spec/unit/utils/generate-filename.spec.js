'use strict';

const chai = require('chai');
const expect = chai.expect;

const generateFilename = require('../../../utils/generate-filename');

describe('Test suite for generate-filename module', () => {
  const file = {
    originalname: 'file.jpg'
  };

  const that = {
    _id: '0123456789'
  };

  it('should return proper filename', () => {
    expect(generateFilename.call(that, file)).to.be.equal('file_0123456789.jpg');
  });

  it('should throw an error if there is no file provided', () => {
    const file = null;

    expect(() => {
      generateFilename.call(that, file)
    }).to.throw();
  });

  it('should throw an error if the file object has no originalFilename property', () => {
    const file = {
      originalname: undefined
    };

    expect(() => {
      generateFilename.call(that, file);
    }).to.throw();
  });

  it('should throw an error if the context object has no _id property', () => {
    const that = {
      _id: undefined
    };

    expect(() => {
      generateFilename.call(that, file);
    }).to.throw();
  });
});