'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const deletePreviousFiles = require('../../../utils/delete-previous-files');

const fs = require('fs');

const newImage = {
  filename: 'new-file.jpg'
};

const folderName = '/path/to/folder/';

const currentFile = {
  filename: 'current-file.jpg'
};

describe('Test suite for delete-previous-files module.', () => {
  afterEach(() => {
    fs.existsSync.restore && fs.existsSync.restore();
    fs.unlinkSync.restore && fs.unlinkSync.restore();
  });

  it('should unlink previous file if it exists', () => {
    sinon.stub(fs, 'existsSync').callsFake(() => true);
    const unlinkSync = sinon.stub(fs, 'unlinkSync').callsFake(() => true);

    deletePreviousFiles(newImage, folderName, currentFile);

    expect(unlinkSync.called).to.be.true;
  });

  it('should not try to unlink previous file if it does not exist', () => {
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const unlinkSync = sinon.stub(fs, 'unlinkSync').callsFake(() => true);

    deletePreviousFiles(newImage, folderName, currentFile);

    expect(unlinkSync.called).to.be.false;
  });

  it('should not check file existence if there is no current file', () => {
    const existsSync = sinon.stub(fs, 'existsSync').callsFake(() => false);

    const currentFile = undefined;

    deletePreviousFiles(newImage, folderName, currentFile);

    expect(existsSync.called).to.be.false;
  });

  it('should not check file existence if newFile and currentFile are the same', () => {
    const existsSync = sinon.stub(fs, 'existsSync').callsFake(() => false);

    deletePreviousFiles(newImage, folderName, newImage);

    expect(existsSync.called).to.be.false;
  });

  it('should throw an error if currentFile has no non-empty filename property', () => {
    const currentFile = {
      filename: ''
    };

    expect(deletePreviousFiles(newImage, folderName, currentFile)).to.be.false;
  });
});