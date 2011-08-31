var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Info').addBatch(
  { "getting info":
      { topic: function() {
        db.manage.info(this.callback); }
      , "should work always": function (err, doc) {
        console.log(doc.serverVersion)
        assert.ok(typeof doc.serverVersion === "string");
        assert.ok(typeof doc.platform === "string");
        assert.ok(typeof doc.indexes === "object"); }  
      }
  }).exportTo(module);