'use strict';

const fs = require('fs');
const keystone = require('keystone');
const _each = require('lodash').each;

// constants
const MONGO_HOOKS = require('./registry/MONGO_HOOKS');
const FIELD_TYPES = require('./registry/FIELD_TYPES');
const CF = require('./registry/CONFIG_FIELDS');

// classes
const MongoDocumentCopy = require('./classes/mongo-document-copy');
const FileFields = require('./classes/file-fields');

// proxy handlers
const getComplexPropertyProxyHandler = require('./proxies/handlers/get-complex-property');

// utils
const getFolderName = require('./utils/get-folder-name');
const generateFilename = require('./utils/generate-filename');
const filterSchemaFields = require('./utils/filter-schema-fields');
const deletePreviousFiles = require('./utils/delete-previous-files');
const normalizePath = require('./utils/normalize-path');
const completePathToFile = require('./utils/complete-path-to-file');

/**
 * Configured via keystone options
 * @type {{pathToPublicFolder: string, virtualPropKey: string, uploadedFilesStorage: string}}
 */
const options = {
  pathToPublicFolder: keystone.get(CF.PUBLIC_URL) || '/images/',

  virtualPropKey: keystone.get(CF.VIRTUAL_PROP_KEY) || 'src',

  uploadedFilesStorage: keystone.get(CF.UPLOADED_FILES_STORAGE)
};

/**
 * This class represents the Facade pattern that is meant to be easy to use tool for managing images in models.
 * To use the Facade in model all you have to do is to create a new instance of the class and invoke it's method init()
 * @tutorial You must instantiate an instance of the class and invoke .init() method BEFORE calling keystone.List.prototype.add() method!
 */
module.exports = class {
  /**
   * Create a new image control decorator
   * @param {object} list - keystone list
   */
  constructor(list) {
    this.list = list;

    this.modelName = list.key;

    this.schemaObject = {};

    this.folderName = getFolderName(this.modelName);

    // empty placeholder where later mongo document _id will be saved
    this.currentMongoDocument = new MongoDocumentCopy();

    this.imageStorage = new keystone.Storage({
                                               adapter: keystone.Storage.Adapters.FS,

                                               fs: {
                                                 path: keystone.expandPath(this.folderName),
                                                 generateFilename: generateFilename.bind(this.currentMongoDocument),
                                                 whenExists: 'overwrite'
                                               }
                                             });

    this.filesToDelete = {};
  }

  /**
   * Init
   */
  init() {
    this.wrapAddMethod();
  }

  /**
   * Wrap original keystone.List.prototype.add method related to current list.
   * As far as the class operates with parameter(-s), passed to add() method, everything starts here.
   */
  wrapAddMethod() {
    const that = this;

    this.list.add = function () {
      that.schemaObject = [].filter.call(arguments, arg => {
        return typeof arg === 'object';
      });

      that.filesToDelete = new FileFields(...that.getFileFieldsNames());

      that.defineVirtuals();

      that.setImageStorageForImageFields();

      that.setHooks();

      keystone.List.prototype.add.apply(that.list, arguments);
    };
  }

  /**
   * Set property 'storage' for file fields
   */
  setImageStorageForImageFields() {
    const that = this;

    setStorageToDeepestElems(this.schemaObject);

    /**
     * Set storage prop for deepest elements if schema object, identified by existence of 'type' property in there
     * @param {object} obj AWARE! The original object will be changed!
     */
    function setStorageToDeepestElems(obj) {
      _each(obj, function (value) {
        if (!value.hasOwnProperty('type')) {
          setStorageToDeepestElems(value);
        } else {
          if (value.type.properName === FIELD_TYPES.FILE) {
            value.storage = that.imageStorage;
          }
        }
      });
    }
  }

  /**
   * Define virtual mongo properties
   */
  defineVirtuals() {
    const that = this;

    this.getFileFieldsNames().forEach(field => {
      this.list.schema.virtual(`${field}.${options.virtualPropKey}`).get(function () {
        const proxyThis = new Proxy(this, getComplexPropertyProxyHandler);

        const pathToFolder = normalizePath(options.pathToPublicFolder + that.modelName);

        return completePathToFile(proxyThis[field].filename, pathToFolder);
      });
    });
  }

  /**
   * Set hooks
   */
  setHooks() {
    this.postInitHook();

    this.preSaveHook();

    this.postSaveHook();
  }

  /**
   * Save names of previous files in order to delete these files if they are useless
   */
  postInitHook() {
    const that = this;

    this.list.schema.post(MONGO_HOOKS.INIT, function () {
      that.currentMongoDocument.setId(this._id);

      const proxyThis = new Proxy(this, getComplexPropertyProxyHandler);

      that.getFileFieldsNames().forEach(field => {
        if (proxyThis[field]) {
          that.filesToDelete.setFilename(field, proxyThis[field].filename);
        }
      });
    });
  }

  /**
   * Throw an error if defined in model files are absent in folder on the server
   */
  preSaveHook() {
    const that = this;

    this.list.schema.pre(MONGO_HOOKS.SAVE, function (next) {
      let fileExists = true,
        filename = '';

      const proxyThis = new Proxy(this, getComplexPropertyProxyHandler);

      that.getFileFieldsNames().forEach(field => {
        filename = proxyThis[field].filename;

        if (filename && filename.toString() !== 'undefined') {
          fileExists = fs.existsSync(keystone.expandPath(that.folderName + filename));

          if (!fileExists) {
            next(new Error(`There is no file: '${filename}' in '${that.folderName}' folder. Please, upload the file again.`));
          }
        }
      });

      next();
    });
  }

  /**
   * On 'post save' hook copy uploaded image to /dist/images folder. It is necessary, because Keystone serve files from dist folder, and we store files in public folder. Dist folder is generated
   * automatically based on public, but generation happens on build step only, so in order to avoid immediate necessity to run build we just copy image fight of hot pursuit.
   */
  postSaveHook() {
    const that = this;

    this.list.schema.post(MONGO_HOOKS.SAVE, function () {
      const proxyThis = new Proxy(this, getComplexPropertyProxyHandler);

      const fileFields = that.getFileFieldsNames();

      if (fileFields.length) {
        fileFields.forEach(fieldsName => {
          deletePreviousFiles(proxyThis[fieldsName], that.folderName, that.filesToDelete[fieldsName]);
        });
      }
    });
  }

  /**
   * Return list of fields of type File
   * @returns {Array} array of strings, keys in schema object, like ['icon', 'asideImageFile']
   */
  getFileFieldsNames() {
    return filterSchemaFields(this.schemaObject).map(item => item.replace(/\d\./, ''));
  }
};