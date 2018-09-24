'use strict';

const chai = require('chai');
const expect = chai.expect;

const MongoDocumentCopy = require('../../../classes/mongo-document-copy');

describe('Test suite for mongo-document-copy module', () => {
  it('should set _id property via constructor if provided', () => {
    const id = '0123456789';
    const instance = new MongoDocumentCopy(id);

    expect(instance._id).to.be.equal(id);
  });

  it('should set _id property to null via constructor if the value is not provided', () => {
    const instance = new MongoDocumentCopy();

    expect(instance._id).to.be.null;
  });

  it('should set _id property via setId method', function () {
    const instance = new MongoDocumentCopy();

    const id = '0123456789';

    instance.setId(id);

    expect(instance._id).to.be.equal(id);
  });
});