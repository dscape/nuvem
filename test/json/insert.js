var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports;

tests.malformed = function (cb) { db.json.insert("a", "", cb); };

tests.malformed_ok = function(e,b,h) {
  assert.equal(e.code,"nuvem:NO-BODY");
  db.json.destroy("a");
};

tests.good_json = function (cb) { 
  db.json.insert("d", {"some": "trash"},
    function () { db.json.get("d", cb); }); 
};

tests.good_json_ok = function(e,doc) {
  assert.isNull(e);
  assert.equal(doc.some, "trash");
  db.json.destroy("d");
};

ensure(__filename, tests, module);