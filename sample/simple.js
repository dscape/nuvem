require.paths.unshift('./lib');

var nuvem = require('nuvem');
var db    = nuvem('http://user:pass@localhost:123');
db.configure('http://admin:admin@localhost:4380');
db.json.get("a", function (err, document ) {
  console.log(err, document);
});
db.json.insert("a", "", function (err) {
  if(err) console.log(err);
});
db.json.insert("a", {"some": "trash"}, function (err) {
  if(err) console.log(err);
});
db.json.insert("a", {some: "bar"}, function (err) {
  if(err) console.log(err);
});
db.json.delete("a", function (err) {
  if(err) console.log(err);
});
db.json.update("a", {blerh: "foo"}, function (err) {
  if(err) console.log(err);
});
