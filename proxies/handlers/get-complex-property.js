'use strict';

module.exports = {
  /**
   * Intercept get request to proxy object
   * @param {object} target
   * @param {*} prop
   * @param {object} receiver
   * @returns {*}
   */
  get: function (target, prop, receiver) {
    prop = prop.toString();

    if (/\./.test(prop)) {
      return getComplexPropValue(target, prop);
    }

    return Reflect.get(...arguments);
  }
};

/**
 * Get value of nested, if necessary, property.
 * @param {object} target
 * @param {string} prop
 * @returns {*}
 * @tutorial The function makes possible to get value of property like obj[some.nested.prop]
 */
function getComplexPropValue(target, prop) {
  return getValue(target, prop.split('.'));

  function getValue(target, props, i) {
    i = i || 0;

    let value = target[props[i]];

    if (value && i < props.length - 1) {
      return getValue(value, props, ++i);
    }

    return value;
  }
}