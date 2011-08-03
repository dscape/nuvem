var vows   = require('vows')
  , assert = require('assert')
  , uri    = require('../lib/nuvem/uris')
  , cfg    = require('../config/marklogic.js');

function credentials() {
  if (cfg.user && cfg.pass) {
    return cfg.user + ":" + cfg.pass + "@";
  }
  return "";
}

function kvUri(creds) {
  return ("http://" + credentials() + cfg.host + ':' + cfg.port + "/" + cfg.json.kv);
}

vows.describe('jsonKV').addBatch(
  { "no kvpairs": function () { assert.equal(uri.json.kv({}), kvUri()); }
  , "empty kvpair": function () { assert.equal(uri.json.kv(), kvUri()); }
  , "one kvpair": function () { 
      assert.equal(uri.json.kv({a:"b"}), kvUri()+"?a=b"); }
  , "two kvpairs": function () {
      assert.equal(uri.json.kv({a:"b",c:"d"}), kvUri()+"?a=b&c=d"); }
  , "index": function () {
      assert.equal(uri.json.kv({a:"b"}, {index:10}), kvUri()+"/10?a=b"); }
  , "index and start": function () {
      assert.equal(uri.json.kv({a:"b"}, {index:10, start: 1}), 
        kvUri()+"/10?a=b"); }
  , "start and end": function () {
      assert.equal(uri.json.kv({a:"b"}, {start:1, end: 3}), 
        kvUri()+"/1/3?a=b"); }
  , "start and no end": function () {
      assert.equal(uri.json.kv({a:"b"}, {start:1}), kvUri()+"?a=b"); }
  , "index and start and end": function () {
      assert.equal(uri.json.kv({a:"b"}, {index:10, start:1, end:2}), 
        kvUri()+"/10?a=b"); }
  }
).run();