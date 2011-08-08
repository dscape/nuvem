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
  , "inserting with bad credentials":
    { topic: function() { 
      var newdb = nuvem(cfg);
      newdb.configure({pass: "somethingwrong"});
      newdb.json.insert("barr", {foo:"bar"}, this.callback); }
    , "should fail": function (err, doc) {
      assert.equal(err.nuvem_code,"DOCSTOREAUTHFAILED"); }  
    }
  }).run();

//db.json.insert("b", {blerh: "foo"}, { quality: 10
//  , permission: ["a","b"]
//  , collection: ["this", "works"] }, 
//  function (err) {
//    if(err) console.log(err);
//});