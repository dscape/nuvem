require.paths.unshift('./lib');

var nuvem = require('nuvem');
var db    = nuvem('http://user:pass@localhost:123');
db.configure('http://admin:admin@localhost:4380');
db.document.get("a", function (err, document ) {
  console.log(err, document);
});
db.document.insert("a", "",
  function (err) {
    console.log(err);
});
db.document.insert("a", {"some": "json"},
  function (err) {
    console.log(err);
});
db.document.insert("a", {some: "json"},
  function (err) {
    console.log(err);
});
try { JSON.parse("%$") } catch(e) { console.log(e) }