var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db;

vows.describe('db.configure').addBatch(
  { "uri": function () { 
      db = nuvem("http://local:123");
      assert.equal(db.options.current.host, "local");
      assert.equal(db.options.current.port, "123");
    }
  , "configure": function () {
      db = nuvem("http://local:123");
      db.configure("http://lacol:321");
      assert.equal(db.options.current.host, "lacol");
      assert.equal(db.options.current.port, "321");
    }
  , "slashes": function () {
      db = nuvem("http://local:123/");
      assert.equal(db.options.current.host, "local");
      assert.equal(db.options.current.port, "123");
    }
  , "bad port": function () {
      db = nuvem(cfg);
      db.configure("http://something:else");
      assert.equal(db.options.current.host, "something");
      assert.equal(db.options.current.port, cfg.port);
    }
  , "deep clone test": function () {
      db = nuvem();
      db.configure(
        { jsonkv: "hell/yeah" }
      );
      db.configure(
        { jsonkv: "something/else" }
      );
      assert.equal(db.options.current.json.kv, "something/else");
    }
  , "uri with auth": function () {
      db = nuvem("http://a:b@local:123");
      assert.equal(db.options.current.host, "local");
      assert.equal(db.options.current.port, "123");
      assert.equal(db.options.current.user, "a");
      assert.equal(db.options.current.pass, "b");
    }
  , "constructor with json": function () {
      db = nuvem(
        { host: "local"
        , port: 123
        , user: "frank"
        , pass: "nooo"
        , jsonstore: "store"
        , jsonkv: "kv"
        , jsonqs: "qs"
        }
      );
      assert.equal(db.options.current.host, "local");
      assert.equal(db.options.current.port, "123");
      assert.equal(db.options.current.user, "frank");
      assert.equal(db.options.current.pass, "nooo");
      assert.equal(db.options.current.json.store, "store");
      assert.equal(db.options.current.json.kv, "kv");
      assert.equal(db.options.current.json.qs, "qs");
    }
  , "constructor with xml": function () {
      db = nuvem(
        { host: "local"
        , port: 123
        , user: "frank"
        , pass: "nooo"
        , xmlstore: "store"
        , xmlkv: "kv"
        , xmlqs: "qs"
        }
      );
      assert.equal(db.options.current.host, "local");
      assert.equal(db.options.current.port, "123");
      assert.equal(db.options.current.user, "frank");
      assert.equal(db.options.current.pass, "nooo");
      assert.equal(db.options.current.xml.store, "store");
      assert.equal(db.options.current.xml.kv, "kv");
      assert.equal(db.options.current.xml.qs, "qs");
    }
  , "opts": function () {
      db = nuvem(cfg);
      db.configure(
        { host: "local"
        , port: 123
        , user: "frank"
        , pass: "nooo"
        , jsonstore: "store"
        , jsonkv: "kv"
        , jsonqs: "qs"
        }
      );
      assert.equal(db.options.current.host, "local");
      assert.equal(db.options.current.port, "123");
      assert.equal(db.options.current.user, "frank");
      assert.equal(db.options.current.pass, "nooo");
      assert.equal(db.options.current.json.store, "store");
      assert.equal(db.options.current.json.kv, "kv");
      assert.equal(db.options.current.json.qs, "qs");
    }
  }
).run();
