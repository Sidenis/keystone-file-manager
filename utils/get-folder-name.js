'use strict';

const keystone = require('keystone');
const normalizePath = require('./normalize-path');

const CF = require('../registry/CONFIG_FIELDS');

/**
 * Save path to current model folder based on model's name
 * @param {string} modelName
 */
module.exports = modelName => {
  if (!modelName) {
    throw new Error(`${__filename} Please, provide model name! Current modelName is ${modelName}`);
  }

  if (!keystone.get(CF.UPLOADED_FILES_STORAGE)) {
    throw new Error(`${__filename} Please, provide keystone option! Current options is ${keystone.get(CF.UPLOADED_FILES_STORAGE)}`);
  }

  return normalizePath(keystone.get(CF.UPLOADED_FILES_STORAGE) + normalizePath(modelName));
};