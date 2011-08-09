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

function xmlBaseDocUri() {
  return "http://" + credentials() + cfg.host + ':' + cfg.port +
  "/" + cfg.xml.store + "/";
}

function noDocUriProvided() {
  var expected = xmlBaseDocUri();
  assert.equal(uri.xml.store(""), expected);
}

function simpleDocUri() {
  var expected = xmlBaseDocUri() + "foo";
  assert.equal(uri.xml.store("foo"), expected);
}

function fooWithEmptyOpts () {
  var expected = xmlBaseDocUri() + "foo";
  assert.equal(uri.xml.store("foo", {}), expected);
}

function fooWithOneOpts () {
  var expected = xmlBaseDocUri() + "foo?foo=bar";
  assert.equal(uri.xml.store("foo", {foo: "bar"}), expected);
}

function fooWithMultipleOpts () {
  var expected = xmlBaseDocUri() + "foo?foo=bar&baz=dog";
  assert.equal(uri.xml.store("foo", {foo: "bar", baz: "dog"}), expected);
}

function slashFoo() {
  var expected = xmlBaseDocUri() + "foo";
  assert.equal(uri.xml.store("/foo"), expected);
}

vows.describe('xmlStore').addBatch(
  { "no document uri is provided": noDocUriProvided
  , "foo as doc uri": simpleDocUri
  , "foo with empty opts": fooWithEmptyOpts
  , "foo with 1 opts": fooWithOneOpts
  , "foo with multiple opts": fooWithMultipleOpts
  , "/foo": slashFoo
  }
).exportTo(module);
