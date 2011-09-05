var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.info = function (cb) {
  db.manage.info(cb);
};

tests.info_ok = function (_,doc) {
  assert.ok(typeof doc.serverVersion === "string");
  assert.ok(typeof doc.platform === "string");
  assert.ok(typeof doc.indexes === "object");
};

ensure(__filename, tests, module);