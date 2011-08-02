// sudo npm install -g vows
// node json-crud.js
var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../config/marklogic.js')
  , nuvem  = require('../index')
  , db     = nuvem(cfg);

vows.describe('Delete JSON').addBatch(
  { "after inserting it":
    { topic: function () {
        var topic = this;
        db.json.insert("a", {"some": "trash"}, function (err) {
          db.json.delete("a", topic.callback); }); }
    , "should work": function (err,doc) {
      assert.isNull(err); }
    }
  , "delete document that doesnt exist":
    { topic: function () {
        db.json.delete("retetetetete", this.callback); }
    , "should fail": function (err,doc) {
      assert.equal(err.nuvem_code,"DOCNOTFOUND"); }
    }
  }).run();