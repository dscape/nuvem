var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Insert XML').addBatch(
  { "with malformed xml": 
    { topic: function() {
        db.xml.insert("a", "<a>f</b>", this.callback); }
    , "which is an empty string": function (err,doc) {
        assert.equal(err.nuvem_code,"DOCMALFORMED");
        db.xml.delete("a"); } 
    }
  , "empty malformed xml": 
    { topic: function() {
        db.xml.insert("a", "", this.callback); }
    , "which is an empty string": function (err,doc) {
        assert.equal(err.nuvem_code,"DOCMALFORMED");
        db.xml.delete("a"); } 
    }
  , "insert decent json":
    { topic: function () {
        var topic = this;
        db.xml.insert("c", "<p>Trash</p>", function (err) {
          db.xml.get("c", topic.callback); }); }
    , "should retrieve the object that was inserted": function (err,doc) {
      assert.equal(doc, "<p>Trash</p>\n");
      db.xml.delete("c"); }
    }
  , "inserting with bad credentials":
    { topic: function() { 
      var newdb = nuvem(cfg);
      newdb.configure({pass: "somethingwrong"});
      newdb.xml.insert("barr", "<foo>bar</foo>", this.callback); }
    , "should fail": function (err, doc) {
      assert.equal(err.nuvem_code,"DOCSTOREAUTHFAILED"); }  
    }
  }).exportTo(module);

//db.xml.insert("b", "<a/>", { quality: 10
//  , permission: ["a","b"]
//  , collection: ["this", "works"] }, 
//  function (err) {
//    if(err) console.log(err);
//});