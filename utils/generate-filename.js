'use strict';

const path = require('path');

/**
 * Generates filename. Should be invoked in context which contains `_id` property
 * @param {object} file
 * @param {string} file.originalname
 * @returns {string} filename like `name-of-file_<_id>.ext`
 */
module.exports = function generateFilename(file) {
  if (!file || !file.originalname) {
    throw new Error(`${__filename} Please, provide a proper file object! Current file object is ${file}`);
  }

  if (!this._id) {
    throw new Error(`${__filename} Please, provide the context which contains _id property! Current context is ${this}`);
  }

  return path.parse(file.originalname).name + '_' + this._id + path.extname(file.originalname);
};