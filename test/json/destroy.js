var ensure = require('ensure')
  , assert = require('assert')
  , db     = require('../../index')(__dirname + '/../fixtures/marklogic.js')
  , tests  = exports;

tests.simple = function (cb) {
  db.json.insert("a", {"some": "trash"}, function (err) {
    db.json.destroy("a", cb); });
};

tests.simple_ok = function(e,b,h) {
  assert.isNull(e);
};

ensure(__filename, tests, module);