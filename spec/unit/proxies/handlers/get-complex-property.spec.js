'use strict';

const chai = require('chai');
const expect = chai.expect;

const proxyHandler = require('../../../../proxies/handlers/get-complex-property');

describe('Test suite for get-complex-property proxy', () => {
  it('should get first level and nested property', () => {
    const obj = {
      a: {
        aa: {
          aaa: 7
        }
      },

      b: {
        bb: 33
      },

      c: 42,

      d: {
        dd: {
          ddd: {
            dddd: {
              ddddd: {
                dddddd: 'really deep property'
              }
            }
          }
        }
      }
    };

    const proxy = new Proxy(obj, proxyHandler);

    expect(proxy['a.aa.aaa']).to.be.equal(7);
    expect(proxy['b.bb']).to.be.equal(33);
    expect(proxy['c']).to.be.equal(42);
    expect(proxy['d.dd.ddd.dddd.ddddd.dddddd']).to.be.equal('really deep property');
  });
});