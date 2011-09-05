var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , helper = require('../helper')
  , db     = nuvem(cfg)
  , tests = exports;

tests.snow = function (cb) {
  helper.setup({db: db, salt: '_snow'},function(e) {
    if(e) { throw e; }
    db.json.first('snow', cb);
  });
};

tests.snow_ok = function(e,b,h) {
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.ok(b.uri.indexOf("/foo/bar/foobar") !== -1);
  helper.teardown({db: db, salt: '_snow'});
};

tests.collections = function (cb) {
  helper.setup({db: db, salt: '_collections', collections: ['dog','red']}
    , function(e) {
        if(e) { throw e; }
        db.json.find('snow', { include: 'all' }, cb);
  });
};

tests.collections_ok = function (e,b,h) {
  assert.isNull(e);
  assert.ok(b.collections.indexOf('red')!==-1);
  helper.teardown({db: db, salt: '_collections'});
};

tests.directories = function (cb) {
  helper.setup({db: db, salt: '_directories'}, function(e){
    if(e) { throw e; }
    db.json.find('fox', { inDirectory: '/foo' }, cb);
  });
};

tests.directories_ok = function (e,b,h) {
  assert.isNull(e);
  assert.ok(b.uri.indexOf("another") !== -1);
  helper.teardown({db: db, salt: '_directories'});
};

ensure(__filename, tests, module);