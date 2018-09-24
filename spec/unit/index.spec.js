'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiSpy = require('chai-spies');
const sinon = require('sinon');

chai.use(chaiSpy);

const ImageFacade = require('../../index');

// classes
const MongoDocumentCopy = require('../../classes/mongo-document-copy');

// constants
const MONGO_HOOKS = require('../../registry/MONGO_HOOKS');
const CF = require('../../registry/CONFIG_FIELDS');

// utils
const getFolderName = require('../../utils/get-folder-name');
const generateFilename = require('../../utils/generate-filename');

const keystone = require('keystone');
const Types = keystone.Field.Types;

describe('Test suite for keystone file manager', () => {
  keystone.set(CF.UPLOADED_FILES_STORAGE, '/uploads/images/');

  it('should correctly instantiate all the property via constructor', () => {
    const list = {
      key: 'mainPageModel'
    };

    const imageFacade = new ImageFacade(list);

    expect(imageFacade.list).to.be.eq(list);
    expect(imageFacade.modelName).to.be.equal(list.key);
    expect(imageFacade.schemaObject).to.be.eql({});
    expect(imageFacade.folderName).to.be.equal(getFolderName(imageFacade.modelName));
    expect(imageFacade.currentMongoDocument).to.be.an.instanceOf(MongoDocumentCopy);

    expect(imageFacade.imageStorage).to.be.an.instanceOf(keystone.Storage);
    expect(imageFacade.imageStorage.adapter.options.path).to.be.equal(keystone.expandPath(imageFacade.folderName));
    expect(JSON.stringify(imageFacade.imageStorage.adapter.options.generateFilename)).to.be.equal(JSON.stringify(generateFilename));
    expect(imageFacade.imageStorage.adapter.options.whenExists).to.be.eq('overwrite');

    expect(imageFacade.filesToDelete).to.be.eql({});
  });

  it('should invoke wrapAddMethod method within init method', () => {
    const list = {
      key: 'mainPageModel'
    };

    const imageFacade = new ImageFacade(list);

    const wrapAddMethodStub = sinon.spy(imageFacade, 'wrapAddMethod');

    imageFacade.init();

    expect(wrapAddMethodStub.called).to.be.true;
  });

  describe('Test sub-suite for wrapAddMethod', () => {
    let list = null;

    beforeEach(() => {
      list = {
        key: 'mainPageModel',

        schema: {
          pre: () => {
          },
          post: () => {
          },

          virtual: () => {
            return {
              get: () => {
              }
            }
          }
        }
      };
    });

    afterEach(() => {
      keystone.List.prototype.add.restore && keystone.List.prototype.add.restore();
    });

    it('should wrap this.list.add method', () => {
      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      expect(list.add).to.be.a('function');
    });

    it('should filter schema object', () => {
      sinon.stub(list.schema, 'pre').callsFake(() => true);
      sinon.stub(list.schema, 'post').callsFake(() => true);
      sinon.stub(keystone.List.prototype, 'add').callsFake(() => true);

      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      list.add('Random string', {}, 'Another random string', {});

      expect(imageFacade.schemaObject.length).to.be.equal(2);
    });

    it('should set a list of files potentially to delete', () => {
      sinon.stub(list.schema, 'pre').callsFake(() => true);
      sinon.stub(list.schema, 'post').callsFake(() => true);
      sinon.stub(keystone.List.prototype, 'add').callsFake(() => true);

      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      list.add(
        {
          meta: {
            title: {
              'en': {
                type: Types.Text,
                label: 'Meta tag title'
              },

              'ru': {
                type: Types.Text,
                label: 'RU'
              }
            },

            icon: {
              type: Types.File,
              label: 'icon'
            },
          }
        },

        {
          asideImage: {
            type: Types.File,
            label: 'asideImage'
          },

          titleScreen: {
            header: {
              'en': {
                type: Types.Text,
                label: 'Slider`s header'
              },

              'ru': {
                type: Types.Text,
                label: 'RU'
              }
            }
          }
        }
      );

      expect(imageFacade.filesToDelete).to.be.eql({
                                                    'meta.icon': {
                                                      filename: ''
                                                    },

                                                    asideImage: {
                                                      filename: ''
                                                    }
                                                  });
    });

    it('should correctly define virtual properties', () => {
      let virtualGetterHasBeenCalledWithCallback = false;

      list.schema.virtual = () => {
        return {
          get: (callback) => {
            virtualGetterHasBeenCalledWithCallback = typeof callback === 'function';
          }
        }
      };

      sinon.stub(list.schema, 'pre').callsFake(() => true);
      sinon.stub(list.schema, 'post').callsFake(() => true);
      sinon.stub(keystone.List.prototype, 'add').callsFake(() => true);

      const virtualWrapper = sinon.spy(list.schema, 'virtual');

      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      list.add(
        {
          icon: {
            type: Types.File,
            label: 'icon'
          }
        }
      );

      expect(virtualWrapper.withArgs('icon.src').called).to.be.true;
      expect(virtualGetterHasBeenCalledWithCallback).to.be.true;
    });

    it('should correctly set storage for image fields', () => {
      sinon.stub(list.schema, 'pre').callsFake(() => true);
      sinon.stub(list.schema, 'post').callsFake(() => true);
      sinon.stub(keystone.List.prototype, 'add').callsFake(() => true);

      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      list.add(
        {
          icon: {
            type: Types.File,
            label: 'icon'
          }
        }
      );

      expect(imageFacade.schemaObject[0].icon.storage).to.have.property('schema');
      expect(imageFacade.schemaObject[0].icon.storage).to.have.property('adapter');
    });

    it('should set hooks', () => {
      const preSaveSpy = chai.spy.on(list.schema, 'pre');
      const postSaveSpy = chai.spy.on(list.schema, 'post');

      sinon.stub(keystone.List.prototype, 'add').callsFake(() => true);

      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      list.add();

      expect(postSaveSpy).to.have.been.called.with(MONGO_HOOKS.INIT);
      expect(preSaveSpy).to.have.been.called.with(MONGO_HOOKS.SAVE);
      expect(postSaveSpy).to.have.been.called.with(MONGO_HOOKS.SAVE);
    });

    it('should invoke original add method', () => {
      sinon.stub(list.schema, 'pre').callsFake(() => true);
      sinon.stub(list.schema, 'post').callsFake(() => true);

      const originalAddMethodSpy = chai.spy.on(keystone.List.prototype, 'add');

      const imageFacade = new ImageFacade(list);

      imageFacade.init();

      list.add();

      expect(originalAddMethodSpy).to.have.been.called();
    });
  });
});