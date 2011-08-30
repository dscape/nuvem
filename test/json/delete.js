var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Delete JSON').addBatch(
  { "deleting with bad credentials":
      { topic: function() {
        var newdb = nuvem(cfg);
        newdb.configure({pass: "somethingwrong"});
        newdb.json.delete("abdc", this.callback); }
      , "should fail": function (e,h,b) {
        assert.equal(e.status_code,401); }  
      }
  , "after inserting it":
    { topic: function () {
        var topic = this;
        db.json.insert("a", {"some": "trash"}, function (err) {
          db.json.delete("a", topic.callback); }); }
    , "should work": function (err,doc) {
      assert.isNull(err); }
    }
  , "delete document that doesnt exist":
    { topic: function () {
        db.json.delete("retetetetete my cat did this", this.callback); }
    , "should fail": function (e,h,b) {
      assert.equal(e.code,'corona:DOCUMENT-NOT-FOUND');
      assert.equal(e.status_code,404); }
    }
  }).exportTo(module);