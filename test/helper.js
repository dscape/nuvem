var public_functions = module.exports = {}
  , default_paths    = ['/foo/bar/foobar', '/foo/bar/barfoo', '/foo/another']
  , default_docs     = [ {foo: 'fox in the snow'}
                       , {bar: 'where do you go'}
                       , {foo: 'to find something you could eat fox'}
                       ]
  ;

public_functions.setup = function (db,salt,paths,docs,collections) {
  var params = {};
  salt       = salt  || "";
  paths      = paths || default_paths;
  docs       = docs  || default_docs;
  if (collections) { params.collection = collections; }
  return [ 
    function(cb) { db.json.insert(paths[0] + salt, docs[0], params, cb); }
  , function(cb) { db.json.insert(paths[1] + salt, docs[1], params, cb); }
  , function(cb) { db.json.insert(paths[2] + salt, docs[2], params, cb); }
  ];
};

public_functions.teardown = function (db,salt,paths,docs) {
  salt       = salt  || "";
  paths      = paths || default_paths;
  docs       = docs  || default_docs;
  return [ function(cb) { db.json.destroy(paths[0] + salt, cb); }
         , function(cb) { db.json.destroy(paths[1] + salt, cb); }
         , function(cb) { db.json.destroy(paths[2] + salt, cb); }
         ];
};