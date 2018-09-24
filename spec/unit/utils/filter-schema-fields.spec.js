'use strict';

const chai = require('chai');
const expect = chai.expect;

const keystone = require('keystone');
const TYPES = keystone.Field.Types;

const filterSchemaFields = require('../../../utils/filter-schema-fields');

describe('Test suite for filter-schema-field module', () => {
  describe('Test sub-suite for simple schema object', () => {
    const simpleSchemaObject = [
      {
        title: {
          'ru': {
            type: String,
            label: 'Title'
          },

          'en': {
            type: String,
            label: 'RU'
          }
        },

        icon: {
          type: TYPES.File,
          label: 'Icon'
        },

        asideImage: {
          type: TYPES.File,
          label: 'asideImage'
        },

        order: {
          type: Number,
          label: 'Order'
        }
      }
    ];

    it('should return an array of field names of specified type', () => {
      expect(filterSchemaFields(simpleSchemaObject)).to.be.eql(['0.icon', '0.asideImage']);
    });

    it('should not change passed schema object', () => {
      const schemaObjJSON = JSON.stringify(simpleSchemaObject);

      filterSchemaFields(simpleSchemaObject);

      expect(schemaObjJSON).to.be.equal(JSON.stringify(simpleSchemaObject));
    });
  });

  describe('Test sub-suite for complicated schema object', () => {
    const complicatedSchemaObject = [
      {
        meta: {
          title: {
            'en': {
              type: TYPES.Text,
              label: 'Meta tag title'
            },

            'ru': {
              type: TYPES.Text,
              label: 'RU'
            }
          },

          icon: {
            type: TYPES.File,
            label: 'icon'
          },
        }
      },

      {
        asideImage: {
          type: TYPES.File,
          label: 'asideImage'
        },

        titleScreen: {
          header: {
            'en': {
              type: TYPES.Text,
              label: 'Slider`s header'
            },

            'ru': {
              type: TYPES.Text,
              label: 'RU'
            }
          }
        }
      }
    ];

    it('should return an array of field names of specified type', () => {
      expect(filterSchemaFields(complicatedSchemaObject)).to.be.eql(['0.meta.icon', '1.asideImage']);
    });
  });

  describe('Test sub-suite for schema object which does not contain fields of type we are interested in', () => {
    const uselessSchemaObject = [
      {
        meta: {
          title: {
            'en': {
              type: TYPES.Text,
              label: 'Meta tag title'
            },

            'ru': {
              type: TYPES.Text,
              label: 'RU'
            }
          }
        }
      },

      {
        titleScreen: {
          header: {
            'en': {
              type: TYPES.Text,
              label: 'Slider`s header'
            },

            'ru': {
              type: TYPES.Text,
              label: 'RU'
            }
          }
        }
      }
    ];

    it('should return an empty array if there is no field of specified type', () => {
      expect(filterSchemaFields(uselessSchemaObject)).to.be.empty;
    });
  });
});