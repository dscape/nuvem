var public_functions = module.exports = {}
  , async            = require('async')
  , default_paths    = ['/foo/bar/foobar', '/foo/bar/barfoo', '/foo/another']
  , default_docs     = [ {foo: 'fox in the snow'}
                       , {bar: 'where do you go'}
                       , {foo: 'to find something you could eat fox'}
                       ]
  ;

public_functions.setup = function (opts,callback) {
  var params = {}
    , db     = opts.db
    , salt   = opts.salt  || ''
    , paths  = opts.paths || default_paths
    , docs   = opts.docs  || default_docs
    , collections = opts.collections
    ;
  if (collections) { params.collection = collections; }
  return async.parallel([
      function(cb) { db.json.insert(paths[0] + salt, docs[0], params, cb); }
    , function(cb) { db.json.insert(paths[1] + salt, docs[1], params, cb); }
    , function(cb) { db.json.insert(paths[2] + salt, docs[2], params, cb); }
    ]
  , callback);
};

public_functions.teardown = function (opts,callback) {
  var db     = opts.db
    , salt   = opts.salt  || ''
    , paths  = opts.paths || default_paths
    , docs   = opts.docs  || default_docs
    ;
  var w = [ function(cb) { db.json.destroy(paths[0] + salt, cb); }
          , function(cb) { db.json.destroy(paths[1] + salt, cb); }
          , function(cb) { db.json.destroy(paths[2] + salt, cb); }
          ];
  if (callback) { async.parallel(w,callback); }
  else          { async.parallel(w); }
};