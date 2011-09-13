/*
  var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.get = function (cb) {
  db.manage.range.create('foo1'
  , { key: 'bar', type: 'string', operator: 'eq' }
  , function(e,b,h) {
    if (e) { return cb(e); }
    db.manage.range.get('foo1', cb);
  });
};

tests.get_ok = function (e,b,h) {
  db.manage.range.destroy('foo1');
  assert.isNull(e);
  assert.equal(b.name,'foo');
  assert.equal(b.key,'bar');
  assert.equal(b.type,'string');
  assert.equal(b.operator,'eq');
};

tests.destroy = function (cb) {
  // some weird problem when creating two indexes at the same time
  setTimeout(function() {
    db.manage.range.create('bar'
    , { key: 'bar', type: 'string', operator: 'eq' }
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
*/