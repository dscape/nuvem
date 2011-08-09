var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg);

vows.describe('Delete XML').addBatch(
  { "deleting with bad credentials":
      { topic: function() {
        var newdb = nuvem(cfg);
        newdb.configure({pass: "somethingwrong"});
        newdb.xml.delete("abdc", this.callback); }
      , "should fail": function (err, doc) {
        assert.equal(err.nuvem_code,"DOCDELAUTHFAILED"); }  
      }
  , "after inserting it":
    { topic: function () {
        var topic = this;
        db.xml.insert("a", "<some>trash</some>", function (err) {
          db.xml.delete("a", topic.callback); }); }
    , "should work": function (err,doc) {
      assert.isNull(err); }
    }
  , "delete document that doesnt exist":
    { topic: function () {
        db.xml.delete("retetetetete my cat did this", this.callback); }
    , "should fail": function (err,doc) {
      assert.equal(err.nuvem_code,"DOCNOTFOUND"); }
    }
  }).exportTo(module);