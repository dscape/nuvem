require.paths.unshift('./lib');

var nuvem = require('nuvem');
var db    = nuvem('http://user:pass@localhost:123');
db.configure('http://admin:admin@localhost:4380');
db.json.get("a", function (err, document ) {
  if(err) console.log(err);
  console.log(document);
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
db.json.delete("a", function (err, document) {
  if(err) console.log(err);
});
db.json.update("a", {blerh: "foo"}, function (err) {
    if(err) console.log(err);
  }
);
db.json.insert("b", {blerh: "foo"}, { quality: 10
  , permission: ["a","b"]
  , collection: ["this", "works"] }, 
  function (err) {
    if(err) console.log(err);
  });
db.json.insert("b", {blerh: "foo"},
  function (err) {
    if(err) console.log(err);
});
db.json.find(
  {some: "bar"},
  {start: 1,
    end: 2},
  function (err, document){
    console.log(err);
    console.log(document);
  }
)