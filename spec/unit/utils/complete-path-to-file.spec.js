'use strict';

const chai = require('chai');
const expect = chai.expect;

const completePathToFile = require('../../../utils/complete-path-to-file');

describe('Test suite for complete-path-to-file module', () => {
  it('should return a concatenation of arguments', () => {
      const filename = 'file.jpg';
      const pathToStorage = '/path/to/storage/';

      expect(completePathToFile(filename, pathToStorage)).to.be.equal(pathToStorage + filename);
  });

  it('Should return null if there is no filename', () => {
    const filename = undefined;
    const pathToStorage = '/path/to/storage/';

    expect(completePathToFile(filename, pathToStorage)).to.be.null;
  });

  it('Should throw an error if there is no path to storage', () => {
    const filename = 'file.jpg';
    const pathToStorage = undefined;

    expect(() => {completePathToFile(filename, pathToStorage)}).to.throw();
  });
});