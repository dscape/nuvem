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

function deleteDoc(name){
  db.xml.delete(name);
}

setup = [ function(callback) { insertDoc("foobar", "<p>Fox in the snow</p>", callback); }
        , function(callback) { insertDoc("barfoo", "<p>Where do you go</p>", callback); }
        , function(callback) { insertDoc("another", "<p>To find something you could eat</p>", callback); }
        ];
teardown = [ function(callback) { deleteDoc("foobar"); }
           , function(callback) { deleteDoc("barfoo"); }
           , function(callback) { deleteDoc("another"); }
           ];

vows.describe('xmlFindQS').addBatch(
  { "Find first foo bar": 
    { topic: function () {
        var topic = this;
        async.parallel(setup,
          function(err, results){
            if(err) { throw err; }
            db.xml.first("snow", topic.callback);
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