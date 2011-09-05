var url      = require('url')
  , _        = require('underscore')
  , err      = require('./error')
  , defaults = {uri: "http://admin:admin@localhost:4830"}
  , request;

/*
 * nuvem module
 * e.g. var nuvem = require('nuvem')('http://user:pass@localhost:123');
 */
module.exports = exports = function nuvem_module(cfg) {
  var public_functions = {}
    , current = cfg || {};

  if(typeof cfg === "string") {
    if(/^https?:/.test(cfg)) { current = {uri: cfg}; } // url
    else { 
      try { current = require(cfg); } // file
      catch(e) { console.error("bad cfg: couldn't load file"); } 
    }
  }
  if(!current.uri) {
    console.error("bad cfg: using default=" + defaults.uri);
    current.uri = defaults.uri; // if everything else fails, use default
  }
  request = require('./request')(current); // proxy support cfg.proxy

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
    var req = { resource: 'json/store'
              , path: uri.replace(/^\/(.*)/, "$1")
              , method: 'PUT'
              , params: opts
              , body: document
              };
    return request.json(req, callback);
  }

 /*
  * get a json document
  *
  * e.g. 
  *   db.json.get("a", function (err,doc,headers) {
  *     if(err) { throw err; }
  *     return document;
  *   });
  *
  * @param {uri:string} the document uri
  * @param {opts:object:optional} extra query string params like quality
  * @param {callback:function:optional} function to call back
  *
  * @see request.js#json
  */
  function get_json(uri,opts,callback) {
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    var get = { resource: 'json/store'
              , path: uri.replace(/^\/(.*)/, "$1")
              , params: opts
              };
    return request.json(get, callback);
  }
  
 /*
  * deletes a json document
  * 
  * e.g. 
  *   db.json.destroy("a", function (err) {
  *     if(err) { throw err; }
  *     return;
  *   });
  *
  * @param {uri:string} the document uri
  * @param {callback:function:optional} function to call back
  *
  * @see request.js#json
  */
  function destroy_json(uri,callback) {
    var del = { resource: 'json/store'
              , path: uri.replace(/^\/(.*)/, "$1")
              , method: "DELETE"
              };
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
  *                  , function (e,b,h) {
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
    var get = {};
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    if(typeof query === "string") {
      get.resource = 'json/query';
      get.params   = _.extend({q: encodeURI(query)}, opts);
    }
    else if(typeof query === "object") {
      get.resource = 'json/kvquery';
      get.params = _.extend(
        _.foldl(
          _.keys(query), 
          function (memo,e) { 
            memo.key.push(e); 
            memo.value.push(query[e]); 
            return memo; },
          {key: [], value: []}),
      opts);
    }
    else {
      return callback(err.nuvem("Please provide either a string or a kv object", "INVALID-QUERY"));
    }
    request.json(get, function (e,b,h){
      if(e) { return callback(e,b,h); }
      if(opts.start === opts.end) {
        b = b.results[0]; 
      }
      return callback(null,b,h);
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
  
  /*
   * returns information about the server version, 
   * hardware and index settings, and more...
   *
   * @param {callback:function:optional} function to call back
   *
   * @return json information regarding the service
   */
   function manage_info(callback) {
     request.json({resource: 'manage'}, callback);
   }

  public_functions = { options:   { current: current
                                  , defaults: defaults
                                  }
                     , json: { get: get_json
                             , insert: insert_json
                             , destroy: destroy_json
                             , find: find_json
                             , first: first_json
                             , nth: find_nth_json
                             }
                     , manage: {info: manage_info}
                     };

  return public_functions;
};