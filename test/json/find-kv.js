var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , helper = require('../helper')
  , db     = nuvem(cfg)
  , tests  = exports
  , paths  = ['foobar', 'foobaz', 'another']
  , docs   = [{foo: 'bar'}, {foo: 'baz'}, {'another': true}] 
  ;

tests.first_foo_bar = function (cb) {
  helper.setup( {db: db, salt: '_foobar', paths: paths, docs: docs}
    , function(e){
        if(e) { throw e; }
        db.json.first({foo: "bar"}, cb);
  });
};

tests.first_foo_bar_ok = function(e,b,h) {
  helper.teardown({db: db, salt: '_foobar', paths: paths, docs: docs});
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.equal(b.uri, "/foobar_foobar");
};

ensure(__filename, tests, module,process.argv[2]);