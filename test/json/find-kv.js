var vows   = require('vows')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../../config/marklogic.js')
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
          function(err, results){
            if(err) { throw err; }
            db.json.first({foo: "bar"}, topic.callback);
          }
        );
      }
    , "should return /foobar": function (err, document){
        if(err) { throw err; }
        assert.equal(document.results[0].uri, "/foobar");
        async.parallel(teardown);
      }
    }
  }
).exportTo(module);