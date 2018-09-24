'use strict';

/**
 * Determines which type of delimiter the path contains
 * @param {string} path
 * @returns {string} delimiter
 */
module.exports = function getPathDelimiter(path) {
  const containsSlash = /\//.test(path);
  const containsBackSlash = /\\/.test(path);

  if (containsSlash && containsBackSlash) {
    throw new Error(`${__filename} Specified path contains both types of slashes!`);
  }

  if (containsSlash) {
    return '/';
  }

  if (containsBackSlash) {
    return '\\';
  }

  throw new Error(`${__filename} Specified path does not contain slashes at all!`);
};