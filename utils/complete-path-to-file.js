'use strict';

const normalizePath = require('./normalize-path');

/**
 * Complete path to file
 * @param {String} filename
 * @param {String} pathToStorage
 * @return {String} - path to file
 */
module.exports = function (filename, pathToStorage) {
  if (!filename) {
    return null;
  }

  if (pathToStorage) {
    return normalizePath(pathToStorage) + filename;
  }

  throw new Error(`${__filename} Please, provide a path to storage! Current path to storage is ${pathToStorage}`);
};