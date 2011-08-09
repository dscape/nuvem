var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Insert XML').addBatch(
  {  "getting with bad credentials":
    { topic: function() { 
      db.configure({pass: "somethingwrong"});
      db.xml.get("fgfd", this.callback); }
    , "should fail": function (err, doc) {
      assert.equal(err.nuvem_code,"DOCGETAUTHFAILED"); }  
    }
  }).exportTo(module);