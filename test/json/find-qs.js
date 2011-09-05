var ensure = require('ensure')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , helper = require('../helper')
  , db     = nuvem(cfg)
  , tests = exports;

tests.snow = function (cb) {
  async.parallel(helper.setup(db,'_snow'), function(e) {
    if(e) { throw e; }
    db.json.first('snow', cb);
  });
};

tests.snow_ok = function(e,b,h) {
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.ok(b.uri.indexOf("/foo/bar/foobar") !== -1);
  async.parallel(helper.teardown(db,'_snow'));
};

tests.collections = function (cb) {
  async.parallel(helper.setup(db,'_collections',null,null,['dog','red']), 
    function(e) {
      if(e) { throw e; }
      db.json.find('snow', { include: 'all' }, cb);
  });
};

tests.collections_ok = function (e,b,h) {
  assert.isNull(e);
  assert.ok(b.collections.indexOf('red')!==-1);
  async.parallel(helper.teardown(db,'_collections'));
};

tests.directories = function (cb) {
  async.parallel(helper.setup(db,'_directories'), function(e){
    if(e) { throw e; }
    db.json.find('fox', { inDirectory: '/foo' }, cb);
  });
};

tests.directories_ok = function (e,b,h) {
  assert.isNull(e);
  assert.ok(b.uri.indexOf("another") !== -1);
  async.parallel(helper.teardown(db,'_directories'));
};

ensure(__filename, tests, module);