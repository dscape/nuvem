var ensure = require('ensure')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports;

tests.first_foo_bar = function (cb) {
  var setup = 
    [ function(callback) { db.json.insert("foobar",  {"foo": "bar"}, callback); }
    , function(callback) { db.json.insert("barfoo",  {"bar": "foo"}, callback); }
    , function(callback) { db.json.insert("another", {"foo": "bar"}, callback); }
    ];
  async.parallel(setup, function(e){
    if(e) { throw e; }
    db.json.first({foo: "bar"}, cb);
  });
};

tests.first_foo_bar_ok = function(e,b,h) {
  var teardown = 
    [ function(callback) { db.json.destroy("foobar", callback); }
    , function(callback) { db.json.destroy("barfoo", callback); }
    , function(callback) { db.json.destroy("another", callback); }
    ];
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.equal(b.uri, "/foobar");
  async.parallel(teardown);
};

ensure(__filename, tests, module);