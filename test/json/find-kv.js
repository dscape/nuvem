var ensure = require('ensure')
  , assert = require('assert')
  , async  = require('async')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , helper = require('../helper')
  , db     = nuvem(cfg)
  , tests  = exports
  , paths  = ['foobar', 'foobaz', 'another']
  , docs   = [{foo: 'bar'}, {foo: 'baz'}, {'another': true}] 
  ;

tests.first_foo_bar = function (cb) {
  async.parallel(helper.setup(db,'_foobar',paths,docs), function(e){
    if(e) { throw e; }
    db.json.find({foo: "bar"}, cb);
  });
};

tests.first_foo_bar_ok = function(e,b,h) {
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.equal(b.uri, "/foobar_foobar");
  async.parallel(helper.teardown(db,'_foobar',paths,docs));
};

ensure(__filename, tests, module);