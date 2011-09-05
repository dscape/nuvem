var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.bad_query = function (cb) { db.json.first(false, cb); };

tests.bad_query_ok = function(e,_) {
  assert.equal(e.code,"nuvem:INVALID-QUERY");
};

ensure(__filename, tests, module);