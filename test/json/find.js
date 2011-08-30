var vows   = require('vows')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('jsonFind').addBatch(
  { "Find false": 
    { topic: function () { db.json.first(false, this.callback); }
    , "should fail": function (err,_,document){
       assert.equal(err.code,"nuvem:INVALID-QUERY");
      }
    }
  }
).exportTo(module);