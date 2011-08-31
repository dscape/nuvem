var vows   = require('vows')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , uri    = require('../../lib/nuvem/uris')(cfg);

function credentials() {
  if (cfg.user && cfg.pass) {
    return cfg.user + ":" + cfg.pass + "@";
  }
  return "";
}

function qsUri() {
  return ("http://" + credentials() + cfg.host + ':' + cfg.port + "/" + cfg.xml.qs);
}

vows.describe('xmlQS').addBatch(
  { "one term": function () { 
      assert.equal(uri.xml.qs("foo"), qsUri() + "?q=foo"); }
  , "phrase search": function () { 
      assert.equal(uri.xml.qs('"foo bar"'), qsUri() + "?q=%22foo%20bar%22"); }
  , "two terms": function () { 
      assert.equal(uri.xml.qs("foo bar"), qsUri() + "?q=foo%20bar"); }
  , "AND": function () { 
      assert.equal(uri.xml.qs("foo AND bar"), qsUri() + "?q=foo%20AND%20bar"); }
  , "contraints": function () { 
      assert.equal(uri.xml.qs("foo bar:baz"), qsUri() + "?q=foo%20bar:baz"); }
  }
).exportTo(module);