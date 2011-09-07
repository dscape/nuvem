var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , helper = require('../helper')
  , db     = nuvem(cfg)
  , tests  = exports
  , paths  = ['john', 'mikeal', 'mary']
  , docs   = [ {p: 'John likes running'}
             , {p: 'Run for the goal'}
             , {p: 'Enjoys walking'}
             ]
  ;

tests.stemmed = function (cb) {
  helper.setup({db: db, salt: '_stemmed', paths: paths, docs: docs}
    , function(e){
        if(e) { return cb(e); }
        db.json.query({contains: 
          { key: 'p'
          , string: 'RUN'
          , caseSensitive: false
          , stemmed: false
          }
        }, cb);
  });
};

tests.stemmed_ok = function(e,b,h) {
  helper.teardown({db: db, salt: '_stemmed', paths: paths});
  if(e) { throw e; }
  assert.equal(h["status-code"],200);
  assert.equal(b, "/foobar_foobar");
};

ensure(__filename, tests, module,process.argv[2]);