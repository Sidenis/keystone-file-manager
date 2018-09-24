'use strict';

module.exports = class FileFields {
  /**
   * @param {string} props
   */
  constructor(...props) {
    if (props && props.length) {
      props.forEach(prop => {
        this[prop] = {
          filename: ''
        };
      });
    }
  }

  /**
   * Set filename
   * @param {string} propName
   * @param {string} value
   */
  setFilename(propName, value) {
    if (!this.hasOwnProperty(propName)) {
      throw new Error('The property must exist!');
    }

    this[propName].filename = value;
  }
};