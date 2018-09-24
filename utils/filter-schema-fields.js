'use strict';

const _cloneDeep = require('lodash').cloneDeep;
const _each = require('lodash').each;
const FIELD_TYPES = require('../registry/FIELD_TYPES');

/**
 * Returns an array of fields name which have specified type
 * @param {array} schemaObject - an object which will be used in keystone.list.add(obj) method
 * @returns {array}
 */
module.exports = function filterSchemaFields(schemaObject) {
  filterSchemaFields.deepest = [];

  // we must not change the initial object
  getDeepestElems(_cloneDeep(schemaObject));

  return filterSchemaFields.deepest = filterSchemaFields.deepest
    .filter(field => field.properName === FIELD_TYPES.FILE)
    .map(field => field.key);

  function getDeepestElems(obj, prefix) {
    prefix = prefix || '';

    _each(obj, function (value, key) {
      if (!value.hasOwnProperty('type')) {
        getDeepestElems(value, getPrefix(prefix) + key);
      } else {
        filterSchemaFields.deepest.push({
                                          key: getPrefix(prefix) + key,

                                          properName: value.type.properName
                                        });

        delete obj[key];
      }
    });
  }

  function getPrefix(prefix) {
    return prefix ? prefix + '.' : prefix;
  }
};