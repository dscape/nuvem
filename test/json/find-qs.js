var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , helper = require('../helper')
  , db     = nuvem(cfg)
  , paths = ['soap', 'many', 'examples']
  , docs  = [{its: 'amazin'}, {run: 'in'}, {crazy: true} ]
  , tests = exports
  ;

tests.phrase = function (cb) {
  helper.setup({db: db, salt: '_phrase'},function(e) {
    if(e) { throw e; }
    db.json.first('"in the snow"', cb);
  });
};

tests.phrase_ok = function(e,b,h) {
  helper.teardown({db: db, salt: '_phrase'});
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.ok(b.uri.indexOf("/foo/bar/foobar") !== -1);
};

tests.snow = function (cb) {
  helper.setup({db: db, salt: '_snow'},function(e) {
    if(e) { throw e; }
    db.json.find('fox', cb);
  });
};

tests.snow_ok = function(e,b,h) {
  helper.teardown({db: db, salt: '_snow'});
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.ok(b.uri.indexOf("/foo/bar/foobar") !== -1);
};

tests.collections = function (cb) {
  helper.setup({db: db, salt: '_collections', collections: ['dog','red']
      , paths: paths, docs: docs }
    , function(e) {
        if(e) { throw e; }
        db.json.find('amazin', { include: 'all' }, cb);
  });
};

tests.collections_ok = function (e,b,h) {
  helper.teardown({db: db, salt: '_collections', paths: paths});
  assert.isNull(e);
  assert.ok(b.collections.indexOf('red')!==-1);
  assert.ok(b.uri.indexOf("soap") !== -1);
};

tests.directories = function (cb) {
  helper.setup({db: db, salt: '_directories'}, function(e){
    if(e) { throw e; }
    db.json.find('fox', { inDirectory: '/foo' }, cb);
  });
};

tests.directories_ok = function (e,b,h) {
  helper.teardown({db: db, salt: '_directories'});
  assert.isNull(e);
  assert.ok(b.uri.indexOf("another") !== -1);
};

ensure(__filename, tests, module,process.argv[2]);