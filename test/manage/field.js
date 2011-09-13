/*
  var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.get = function (cb) {
  db.manage.field.create('abst'
  , { includeKey: ['abstract', 'summation', 'introduction'] }
  , function(e,b,h) {
    if (e) { return cb(e); }
    db.manage.field.get('abs', cb);
  });
};

tests.get_ok = function (e,b,h) {
  db.manage.field.destroy('abst');
  assert.isNull(e);
  assert.equal(b.name,'abst');
  assert.equal(b.mode,'contains');
  assert.equal(b.includes.length,3);  
};

tests.destroy = function (cb) {
  // some weird problem when creating two fields at the same time
  setTimeout(function() {
    db.manage.field.create('author'
    , { includeKey: ['artist', 'author'] }
    , function(e,b,h) {
      if (e) { return cb(e); }
      db.manage.field.destroy('author', cb);
    });}, 1000);
};

tests.destroy_ok = function (e,b,h) {
  assert.isNull(e);
  assert.equal(JSON.stringify(b),'{}');
  assert.equal(h['status-code'],200);
};

ensure(__filename, tests, module,process.argv[2]);
*/