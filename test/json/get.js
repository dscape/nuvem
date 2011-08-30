var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Insert JSON').addBatch(
  {  "getting with bad credentials":
    { topic: function() { 
      db.configure({pass: "somethingwrong"});
      db.json.get("fgfd", this.callback); }
    , "should fail": function (err,headers,doc) {
      assert.equal(err['status-code'],401); }  
    }
  }).exportTo(module);