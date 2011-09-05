var ensure = require('ensure')
  , assert = require('assert')
  , helper = require('../helper')
  , db     = require('../../index')(__dirname + '/../fixtures/marklogic.js')
  , tests  = exports
  , paths1 = ['i', 'are', 'dino']
  , docs1  = [{dino: false}, {dino: false}, {dino: 'RWAR'} ]
  , paths2 = ['mr', 'tamborine', 'man']
  , docs2  = [{hey: 'mr tamborine man'}, {play: 'a song for me'}, {im: 'not sleepy'}]
  ;

tests.simple = function (cb) {
  db.json.insert("a", {"some": "trash"}, function (err) {
    db.json.destroy("a", cb); });
};

tests.simple_ok = function(e,b,h) {
  assert.isNull(e);
};

tests.bulk_query = function (cb) {
  helper.setup({db: db, salt: '_bulk_query', paths: paths2, docs: docs2}
    , function(e) {
        if(e) { throw e; }
        db.json.destroy({ q: 'tamborine', bulkDelete: true}, cb);
  });
};

tests.bulk_query_ok = function (e,b,h) {
  assert.isNull(e);
  assert.equal(b[0],'/mr_bulk_query');
  helper.teardown({db: db, salt: '_bulk_query', paths: paths2});
};

tests.bulk_custom_query = function (cb) {
  helper.setup({db: db, salt: '_bulk_custom_query', paths: paths1, docs: docs1}
    , function(e) {
        if(e) { throw e; }
        db.json.destroy({ customquery: { equals: { key: 'dino', value: 'RWAR' } }
          , bulkDelete: true }, cb);
  });
};

tests.bulk_custom_query_ok = function (e,b,h) {
  assert.isNull(e);
  assert.equal(b[0],'/dino_bulk_custom_query');
  helper.teardown({db: db, salt: '_bulk_custom_query', paths: paths1});
};

// try to delete two docs without the bulkDelete should return 400
tests.non_bulk_fails = function (cb) {
  helper.setup({db: db, salt: '_non_bulk_fails'}
    , function(e) {
        if(e) { throw e; }
        db.json.destroy({ q: 'fox' }, cb);
  });
};

tests.non_bulk_fails_ok = function (e,b,h) {
  assert.equal(e.code, 'corona:BULK-DELETE');
  assert.equal(e['status-code'], 400);
  helper.teardown({db: db, salt: '_non_bulk_fails'});
};

tests.no_docs_found = function (cb) {
  helper.setup({db: db, salt: '_no_docs_found'}
    , function(e) {
        if(e) { throw e; }
        db.json.destroy({ q: 'idonotexistdoi' }, cb);
  });
};

tests.no_docs_found_ok = function (e,b,h) {
  assert.equal(e.code, 'corona:DOCUMENT-NOT-FOUND');
  assert.equal(e['status-code'], 404);
  helper.teardown({db: db, salt: '_no_docs_found'});
};

ensure(__filename, tests, module);