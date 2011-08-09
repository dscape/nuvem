var vows   = require('vows')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('xmlFind').addBatch(
  { "Find false": 
    { topic: function () { db.xml.first(false, this.callback); }
    , "should fail": function (err, document){
       assert.equal(err.nuvem_code,"INVALID_QUERY");
      }
    }
  }
).exportTo(module);