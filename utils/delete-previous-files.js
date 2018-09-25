'use strict';

const fs = require('fs');
const keystone = require('keystone');
const normalizePath = require('./normalize-path');

/**
 * Manages uploaded file, copy it to necessary destination, removes previous version
 * @param {object} newImage - image field that just has been setup
 * @param {string} newImage.filename
 * @param {string} folderName
 * @param {object} currentFile - this object should be passed by reference
 * @param {string} currentFile.filename
 * @return {boolean} true if succeed
 */
module.exports = function (newImage, folderName, currentFile) {
  folderName = normalizePath(folderName);

  if (currentFile) {
    const currentFileName = currentFile.filename;

    if (!currentFileName) {
      console.debug(`${__filename} Filename of current file must be provided!`);

      return false;
    }

    try {
      if (newImage.filename !== currentFileName) {
        const currentFilePath = keystone.expandPath(folderName + currentFileName);

        if (fs.existsSync(currentFilePath)) {
          fs.unlinkSync(currentFilePath);

          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }

  }
};