
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