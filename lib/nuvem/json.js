var _           = require('underscore')
  , request_module = require('./request')
  , err         = require('./error')
  , uris_module = require('./uris');

module.exports = exports = function json_module(config) {
  var current   = _.clone(config)
    , urls      = uris_module(config) // generate modules with config
    , request   = request_module(config)
    , public_functions = {};

 /*
  * insert a json document
  *
  * @param {uri:string} the document uri
  * @param {document:object|string} the json document you want to store
  * @param {opts:object:optional} extra query string params like quality
  * @param {callback:function:optional} function to call back
  *
  * @see request.js#json
  */
  function insert_json(uri,document,opts,callback) {
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    var req = { uri: urls.json.store(uri,opts)
              , method: 'PUT'
              , body: document
              };
    return request.json(req, callback);
  }

 /*
  * get a json document
  *
  * e.g. 
  *   db.json.get("a", function (err,headers,document) {
  *     if(err) { throw err; }
  *     return document;
  *   });
  *
  * @param {uri:string} the document uri
  * @param {callback:function:optional} function to call back
  *
  * @see request.js#json
  */
  function get_json(uri,callback) {
    var get = { uri: urls.json.store(uri) };
    return request.json(get, callback);
  }
  
 /*
  * deletes a json document
  * 
  * e.g. 
  *   db.json.delete("a", function (err) {
  *     if(err) { throw err; }
  *     return;
  *   });
  *
  * @param {uri:string} the document uri
  * @param {callback:function:optional} function to call back
  *
  * @see request.js#json
  */
  function delete_json(uri,callback) {
    var del = { uri: urls.json.store(uri), method: "DELETE" };
    return request.json(del, callback);
  }
 
 /*
  * find json documents matching either a qs query or kv query
  *
  * https://github.com/marklogic/Corona/wiki/Key-Value-Query-Service
  *
  * e.g. var login = "dscape";
  *      db.json.find( { github: login
  *                    , twitter: login 
  *                    }
  *                  , { start: 1
  *                    , end: 10
  *                    }
  *                  , function (e,h,b) {
  *                      if(e) { return console.log(err); }
  *                      var user_from_db = response.results[0];
  *                      console.log(user_from_db);
  *                    });
  *
  * @error {nuvem:INVALID-QUERY} query was neither a string or a kv object
  *
  * @param {query:string|object} the query
  * @param {opts:object:optional} either index or start & end
  * @param {callback:function:optional} function to call back
  *
  * @return a json response containing outputs in the "results" property
  */
  function find_json(query,opts,callback) {
    var url, get;
    if(typeof query === "string") {
      url = urls.json.qs(query,opts,current);
    }
    else if(typeof query === "object") {
      url = urls.json.kv(query,opts,current);
    }
    else {
      return callback(err.nuvem("Please provide either a string or a kv object", "INVALID-QUERY"));
    }
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    request.json({uri: url}, function (e,h,b){
      if(e) { return callback(e,h,b); }
      if(opts.start === opts.end) {
        b = b.results[0]; 
      }
      return callback(null,h,b);
    });
  }

 /*
  * alias for find_json(query, {index: n}, callback).response.results[0]
  *
  * @see find_json
  */
  function find_nth_json(n,query,callback) {
    find_json(query,{start: n, end: n},callback);
  }

 /*
  * alias for find_json(query, {index: 1}, callback).response.results[0]
  *
  * @see find_json
  */
  function first_json(query, callback) {
    find_json(query, {start:1, end: 1}, callback);
  }

  public_functions = { "get": get_json
                     , "insert": insert_json
                     , "delete": delete_json
                     , "find": find_json
                     , "first": first_json
                     , "nth": find_nth_json
                     };

  return public_functions;
};