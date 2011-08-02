// sudo npm install -g vows
// node json-insert.js
var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../config/marklogic.js')
  , nuvem  = require('../index')
  , db     = nuvem(cfg);

vows.describe('Insert JSON').addBatch(
  { "with malformed json": 
    { topic: function() {
        db.json.insert("a", "", this.callback); }
    , "which is an empty string": function (err,doc) {
        assert.equal(err.nuvem_code,"DOCMALFORMED"); } 
    }
  , "insert decent json":
    { topic: function () {
        var topic = this;
        db.json.insert("a", {"some": "trash"}, function (err) {
          db.json.get("a", topic.callback); }); }
    , "should retrieve the object that was inserted": function (err,doc) {
      assert.equal(doc.some, "trash"); }
    }
  }).run();