'use strict';

/**
 * Add slashes (if necessary) at the start and at the end of path
 * @param {string} path
 * @returns {string} normalized path
 */
module.exports = path => {
  if (path[path.length - 1] !== '/') {
    path += '/';
  }

  if (path[0] !== '/') {
    path = '/' + path;
  }

  path = path
    .replace(/\/\//g, '/')
    .replace(/\/\//g, '/');

  return path;
};