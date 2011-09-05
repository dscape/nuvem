var ensure = require('ensure')
  , assert = require('assert')
  , cfg    = require('../fixtures/marklogic.js')
  , nuvem  = require('../../index')
  , db     = nuvem(cfg)
  , tests = exports
  ;

tests.malformed = function (cb) { db.json.insert("a", "", cb); };

tests.malformed_ok = function(e,b,h) {
  assert.equal(e.code,"nuvem:NO-BODY");
  db.json.destroy("a");
};

tests.good_json = function (cb) { 
  db.json.insert("d", {"some": "trash"},
    function () { db.json.get("d", cb); }); 
};

tests.good_json_ok = function(e,doc) {
  assert.isNull(e);
  assert.equal(doc.some, "trash");
  db.json.destroy("d");
};

tests.parameters = function (cb) { 
  db.json.insert("f", {"foo": "beh"}
                    , { property: "a:b"
                      , collection: ['c','d']
                      , quality: 5
                      },
    function () { db.json.get( "f", { include: 'all' }, cb); }); 
};

tests.parameters_ok = function(e,response) {
  assert.isNull(e);
  assert.equal(response.content.foo, "beh");
  assert.equal(response.properties.a, "b");
  assert.equal(response.collections[1], "d");
  assert.equal(response.quality, 5);
  db.json.destroy("f");
};

tests.extract_path = function (cb) { 
  db.json.insert("g", {some: {real: {nesting: 'broke' }}},
    function () { db.json.get("g", {extractPath: 'some.real.nesting'}, cb); });
};

tests.extract_path_ok = function(e,doc) {
  assert.isNull(e);
  assert.equal(doc,'broke');
  db.json.destroy("g");
};

ensure(__filename, tests, module);