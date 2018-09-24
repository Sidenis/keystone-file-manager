'use strict';

/**
 * Represents simple copy of Mongo document
 * @type {module.MongoDocumentCopy}
 */
module.exports = class MongoDocumentCopy {
  /**
   * @param {Object} _id
   */
  constructor(_id) {
    this._id = _id || null;
  }

  /**
   * Set id
   * @param {Object} id
   */
  setId(id) {
    this._id = id;
  }
};