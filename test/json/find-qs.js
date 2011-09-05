var ensure = require('ensure')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports;

function setup(salt,collections) {
  var params = {};
  salt = salt || "";
  if (collections) { params.collection = collections; }
  return [ 
    function(callback) { db.json.insert("/foo/bar/foobar" + salt,
      {"foo": "fox in the snow"}, params, callback); }
  , function(callback) { db.json.insert("/foo/bar/barfoo" + salt,
      {"bar": "where do you go"}, params, callback); }
  , function(callback) { db.json.insert("/foo/another" + salt,
      {"foo": "to find something you could eat fox"}, params, callback); }
  ];
}

function teardown(salt) {
  return [
    function(callback) { db.json.destroy("/foo/bar/foobar" + salt, callback); }
  , function(callback) { db.json.destroy("/foo/bar/barfoo" + salt, callback); }
  , function(callback) { db.json.destroy("/foo/another" + salt, callback); }
  ];
}

tests.snow = function (cb) {
  async.parallel(setup('_snow'), function(e) {
    if(e) { throw e; }
    db.json.first('snow', cb);
  });
};

tests.snow_ok = function(e,b,h) {
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.ok(b.uri.indexOf("/foo/bar/foobar") !== -1);
  async.parallel(teardown('_snow'));
};

tests.collections = function (cb) {
  async.parallel(setup('_collections', ['dog','red']), function(e){
    if(e) { throw e; }
    db.json.find('snow', { include: 'all' }, cb);
  });
};

tests.collections_ok = function (e,b,h) {
  assert.isNull(e);
  assert.ok(b.collections.indexOf('red')!==-1);
  async.parallel(teardown('_collections'));
};

tests.directories = function (cb) {
  async.parallel(setup('_directories'), function(e){
    if(e) { throw e; }
    db.json.find('fox', { inDirectory: '/foo' }, cb);
  });
};

tests.directories_ok = function (e,b,h) {
  assert.isNull(e);
  assert.ok(b.uri.indexOf("another") !== -1);
  async.parallel(teardown('_directories'));
};

ensure(__filename, tests, module);