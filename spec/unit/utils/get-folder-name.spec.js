'use strict';

const sinon  = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const CF = require('../../../registry/CONFIG_FIELDS');

const keystone = require('keystone');

const getFolderName = require('../../../utils/get-folder-name');

describe('Test suite for get-folder-name module.', () => {
  afterEach(() => {
    keystone.get.restore && keystone.get.restore();
  });

  const modelName = 'dasModel';
  const keystoneOption = CF.UPLOADED_FILES_STORAGE;

  it('should return concatenation of keystone option and model`s name', () => {
    const keystoneStub = sinon.stub(keystone, 'get');

    keystoneStub.withArgs(keystoneOption).returns('/uploads/images/');

    expect(getFolderName(modelName)).to.be.equal(`/uploads/images/${modelName}/`);
  });

  it('should throw an error if there is no model name provided', () => {
    const modelName = undefined;

    expect(() => {getFolderName(modelName)}).to.throw();
  });

  it('should throw an error if there is no keystone option provided', () => {
    const keystoneStub = sinon.stub(keystone, 'get');

    keystoneStub.withArgs(keystoneOption).returns(undefined);

    expect(() => {getFolderName(modelName)}).to.throw();
  });
});