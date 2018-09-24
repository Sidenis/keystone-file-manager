'use strict';

const chai = require('chai');
const expect = chai.expect;

const FileFields = require('../../../classes/file-fields');

describe('Test suite for file-fields module', () => {
  it('should create instances fields accordingly passed to constructor parameters', () => {
    const fileFields = new FileFields('prop1', 'prop2', 'prop3');

    expect(['prop1', 'prop2', 'prop3'].every(prop => fileFields[prop])).to.be.true;
  });

  it('should set filename property for every instance property', () => {
    const fileFields = new FileFields('prop1', 'prop2', 'prop3');

    expect(['prop1', 'prop2', 'prop3'].every(prop => fileFields[prop].hasOwnProperty('filename'))).to.be.true;
  });

  it('should set value of filename property passed to setFilename method', () => {
    const propName = 'prop1';
    const value = 'value of prop1';

    const fileFields = new FileFields(propName);

    fileFields.setFilename(propName, value);

    expect(fileFields[propName].filename).to.be.equal(value);
  });

  it('should throw an error if we try to set value of non-existent property', () => {
    const fileFields = new FileFields('prop');

    expect(() => {fileFields.setFilename('nonExistentProp', 'some value')}).to.throw();
  });
});