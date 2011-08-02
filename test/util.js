// sudo npm install -g vows
// node util.js
var vows   = require('vows')
  , assert = require('assert')
  , u      = require('../lib/nuvem/util');

vows.describe('qs_stringify').addBatch(
  { "empty opts": function() { assert.equal(u.qs_stringify({}), ""); }
  , "no opts": function() { assert.equal(u.qs_stringify(), ""); }
  , "one opt": function() { assert.equal(u.qs_stringify({f: "b"}), "?f=b"); }
  , "multiple opts": function() { 
      assert.equal(u.qs_stringify({f: "b", a: "c"}), "?f=b&a=c"); }
  }
).run();
