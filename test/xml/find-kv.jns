var vows   = require('vows')
  , assert = require('assert')
  , async  = require('async')
  , XML    = require('xml-simple')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , setup
  , teardown;

function insertDoc(uri,doc,callback) {
  db.xml.insert(uri, doc, 
  function (err) {
    if(err) { callback(err); return; }
    callback(null);
  });
}

function deleteDoc(name,callback){
  db.xml.delete(name);
}

setup = [ function(callback) { insertDoc("foobar", "<foo>bar</foo>", callback); }
        , function(callback) { insertDoc("barfoo", "<bar>foo</bar>", callback); }
        , function(callback) { insertDoc("another", "<foo>bar</foo>", callback); }
        ];
teardown = [ function(callback) { deleteDoc("foobar", callback); }
           , function(callback) { deleteDoc("barfoo", callback); }
           , function(callback) { deleteDoc("another", callback); }
           ];

vows.describe('xmlFindKV').addBatch(
  { "Find first foo bar": 
    { topic: function () {
        var topic = this;
        async.parallel(setup,
          function(err, results){
            if(err) { throw err; }
            db.xml.first({foo: "bar"}, topic.callback);
          }
        );
      }
    , "should return /foobar": function (err, document){
        if(err) { throw err; }
        XML.parse(document, function(err,doc) {
          assert.isNull(err);
          assert.equal(doc.results.result.uri, "/foobar");
          async.parallel(teardown);
        })
      }
    }
  }
).exportTo(module);