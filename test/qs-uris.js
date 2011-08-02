// sudo npm install -g vows
// node qs-uris.js
var vows   = require('vows')
  , assert = require('assert')
  , uri    = require('../lib/nuvem/uris')
  , cfg    = require('../config/marklogic.js');

function qsUri() {
  return ("http://" + cfg.host + ':' + cfg.port + "/" + cfg.json.qs);
}

vows.describe('jsonQS').addBatch(
  { "one term": function () { 
      assert.equal(uri.json.qs("foo"), qsUri() + "?q=foo"); }
  , "phrase search": function () { 
      assert.equal(uri.json.qs('"foo bar"'), qsUri() + "?q=%22foo%20bar%22"); }
  , "two terms": function () { 
      assert.equal(uri.json.qs("foo bar"), qsUri() + "?q=foo%20bar"); }
  , "AND": function () { 
      assert.equal(uri.json.qs("foo AND bar"), qsUri() + "?q=foo%20AND%20bar"); }
  , "contraints": function () { 
      assert.equal(uri.json.qs("foo bar:baz"), qsUri() + "?q=foo%20bar:baz"); }
  }
).run();