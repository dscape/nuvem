var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Insert JSON').addBatch(
  { "with malformed json": 
    { topic: function() {
        db.json.insert("a", "", this.callback);
         }
    , "which is an empty string": function (e,h,b) {
        assert.equal(e.code,"nuvem:NO-BODY");
        db.json.delete("a"); } 
    }
  , "insert decent json":
    { topic: function () {
        var topic = this;
        db.json.insert("c", {"some": "trash"}, function (err) {
          db.json.get("c", topic.callback); }); }
    , "should retrieve the object that was inserted": function (err,_,doc) {
      assert.equal(doc.some, "trash");
      db.json.delete("c"); }
    }
  , "inserting with bad credentials":
    { topic: function() { 
      var newdb = nuvem(cfg);
      newdb.configure({pass: "somethingwrong"});
      newdb.json.insert("barr", {foo:"bar"}, this.callback); }
    , "should fail": function (err,_,_) {
      assert.equal(err["status-code"],401); }  
    }
  }).exportTo(module);

//db.json.insert("b", {blerh: "foo"}, { quality: 10
//  , permission: ["a","b"]
//  , collection: ["this", "works"] }, 
//  function (err) {
//    if(err) console.log(err);
//});