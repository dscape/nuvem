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

function jsonBaseDocUri() {
  return "http://" + credentials() + cfg.host + ':' + cfg.port +
  "/" + cfg.json.store + "/";
}

function noDocUriProvided() {
  var expected = jsonBaseDocUri();
  assert.equal(uri.json.store(""), expected);
}

function simpleDocUri() {
  var expected = jsonBaseDocUri() + "foo";
  assert.equal(uri.json.store("foo"), expected);
}

function fooWithEmptyOpts () {
  var expected = jsonBaseDocUri() + "foo";
  assert.equal(uri.json.store("foo", {}), expected);
}

function fooWithOneOpts () {
  var expected = jsonBaseDocUri() + "foo?foo=bar";
  assert.equal(uri.json.store("foo", {foo: "bar"}), expected);
}

function fooWithMultipleOpts () {
  var expected = jsonBaseDocUri() + "foo?foo=bar&baz=dog";
  assert.equal(uri.json.store("foo", {foo: "bar", baz: "dog"}), expected);
}

function slashFoo() {
  var expected = jsonBaseDocUri() + "foo";
  assert.equal(uri.json.store("/foo"), expected);
}

vows.describe('jsonStore & xmlStore').addBatch(
  { "no document uri is provided": noDocUriProvided
  , "foo as doc uri": simpleDocUri
  , "foo with empty opts": fooWithEmptyOpts
  , "foo with 1 opts": fooWithOneOpts
  , "foo with multiple opts": fooWithMultipleOpts
  , "/foo": slashFoo
  }
).run();
