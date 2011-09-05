var ensure = require('ensure')
  , assert = require('assert')
  , async  = require('async')
  , db     = require('../../index')(__dirname + '/../fixtures/marklogic.js')
  , tests  = exports;

tests.simple = function (cb) {
  db.json.insert("a", {"some": "trash"}, function (err) {
    db.json.destroy("a", cb); });
};

tests.simple_ok = function(e,b,h) {
  assert.isNull(e);
};

//tests.bulk_query = function (cb) {
//  async.parallel(helper.setup(db,'_bulk_query'), function(e){
//    if(e) { throw e; }
//    db.json.destroy(, cb);
//  });
//};
//
//tests.bulk_query_ok = function (e,b,h) {
//  assert.isNull(e);
//}

tests.bulk_custom_query = function (cb) {
  cb(null,true);
};

tests.bulk_custom_query_ok = function (e,b,h) {
  assert.isNull(e);
}

tests.non_bulk_fails = function (cb) {
  // try to delete two docs without the bulkDocs should give 400
  cb(null,true);
};

tests.non_bulk_fails_ok = function (e,b,h) {
  assert.isNull(e);
}

tests.no_docs_found = function (cb) {
  // tried to delete but no documents match query
  cb(null,true);
};

tests.no_docs_found_ok = function (e,b,h) {
  assert.isNull(e);
}

ensure(__filename, tests, module);