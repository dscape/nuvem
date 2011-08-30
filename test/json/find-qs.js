var vows   = require('vows')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , setup
  , teardown;

function insertDoc(uri,doc,callback) {
  db.json.insert(uri, doc, 
  function (err) {
    if(err) { callback(err); return; }
    callback(null);
  });
}

function deleteDoc(name){
  db.json.delete(name);
}

setup = [ function(callback) { insertDoc("foobar",  {"foo": "Fox in the snow"}, callback); }
        , function(callback) { insertDoc("barfoo",  {"bar": "Where do you go"}, callback); }
        , function(callback) { insertDoc("another", {"foo": "To find something you could eat"}, callback); }
        ];
teardown = [ function(callback) { deleteDoc("foobar"); }
           , function(callback) { deleteDoc("barfoo"); }
           , function(callback) { deleteDoc("another"); }
           ];

vows.describe('jsonFindQS').addBatch(
  { "Find first foo bar": 
    { topic: function () {
        var topic = this;
        async.parallel(setup,
          function(err, results){
            if(err) { throw err; }
            db.json.first("snow", topic.callback);
          }
        );
      }
    , "should return /foobar": function (err,_,document){
        if(err) { throw err; }
        assert.equal(document.uri, "/foobar");
        async.parallel(teardown);
      }
    }
  }
).exportTo(module);