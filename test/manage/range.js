var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.get = function (cb) {
  db.manage.range.create('foo'
  , { key: 'foo', type: 'string' }
  , function(e,b,h) {
    if (e) { return cb(e); }
    db.manage.range.get('foo', cb);
  });
};

tests.get_ok = function (e,b,h) {
  db.manage.range.destroy('foo');
  assert.isNull(e);
  assert.equal(b,'WHAT?');
};

tests.destroy = function (cb) {
  // some weird problem when creating two indexes at the same time
  setTimeout(function() {
    db.manage.range.create('bar'
    , { key: 'bar', type: 'string' }
    , function(e,b,h) {
      if (e) { return cb(e); }
      db.manage.range.destroy('bar', cb);
    });}, 1000);
};

tests.destroy_ok = function (e,b,h) {
  assert.isNull(e);
  assert.equal(JSON.stringify(b),'{}');
  assert.equal(h['status-code'],200);
};

ensure(__filename, tests, module,process.argv[2]);