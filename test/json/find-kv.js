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
  function (e,_,b) {
    if(e) { callback(e); return; }
    callback(null,b);
  });
}

function deleteDoc(name,callback){
  db.json.delete(name);
}

setup = [ function(callback) { insertDoc("foobar",  {"foo": "bar"}, callback); }
        , function(callback) { insertDoc("barfoo",  {"bar": "foo"}, callback); }
        , function(callback) { insertDoc("another", {"foo": "bar"}, callback); }
        ];
teardown = [ function(callback) { deleteDoc("foobar", callback); }
           , function(callback) { deleteDoc("barfoo", callback); }
           , function(callback) { deleteDoc("another", callback); }
           ];

vows.describe('jsonFindKV').addBatch(
  { "Find first foo bar": 
    { topic: function () {
        var topic = this;
        async.parallel(setup,
          function(e,h,b){
            if(e) { throw e; }
            db.json.first({foo: "bar"}, topic.callback);
          }
        );
      }
    , "should return /foobar": function (e,h,b){
        if(e) { throw e; }
        assert.equal(h["status-code"],200);
        assert.equal(b.uri, "/foobar");
        async.parallel(teardown);
      }
    }
  }
).exportTo(module);