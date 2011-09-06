var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , err      = require('../../lib/nuvem/error')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.empty_error = function (callback) {
  callback(null,err.socket(null,null,null,null));
};

tests.empty_error_ok = function (_,e) {
  assert.equal(e.message, "unknown");
  assert.equal(e["status-code"], 500);
  assert.equal(e.code, 'socket:unknown');
  assert.isEmpty(e.request);
};

tests.error_412 = function (callback) {
  callback(null,err.socket(null,null,null,412));
};

tests.error_412_ok = function (_,e) {
  assert.equal(e.message, "unknown");
  assert.equal(e["status-code"], 412);
  assert.equal(e.code, 'socket:unknown');
  assert.isEmpty(e.request);
};

ensure(__filename, tests, module,process.argv[2]);