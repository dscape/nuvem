var url     = require('url')
  , request = require('request')
  , config  = require('../../config/marklogic')
  , err     = require('./error')
  , _       = require('underscore')
  , qs      = require('querystring')
  , version = "0.0.1";

/*
 * Nuvem Module
 *
 * e.g. var nuvem = require('nuvem');
 *      var db    = nuvem('http://user:pass@localhost:123');
 */
module.exports = exports = function Nuvem(args) {
  var options   = config;

 /*
  * Configures the access to MarkLogic.
  *
  * Examples:
  *
  *    db.configure('http://user:pass@host:123');
  *    // > { user: 'user', pass: 'pass', host: 'host', port: '123' }
  *    // Will only change the setting you provide - rest remains unaltered
  *    db.configure({
  *      user: "admin",
  *      pass: "admin"
  *    });
  *    // > { user: 'admin', pass: 'admin', host: 'host', port: '123', db: 'Sample' }
  *
  * @param {params} Either the URL or a JSON object with params you want to alter
  *
  * @return {Configuration} The altered options object
  */
  function configureNuvem(args) {
    if (typeof args === 'string') {
      var parsedUrl = url.parse(args,false);
      options.user = (parsedUrl.auth && parsedUrl.auth.split(':')[0]) || options.user;
      options.pass = (parsedUrl.auth && parsedUrl.auth.split(':')[1]) || options.pass;
      options.host = parsedUrl.hostname || options.host;
      options.port = parsedUrl.port     || options.port;
// We dont support multiple databases for now
//        options.db   = parsedUrl.pathname && parsedUrl.pathname.replace(/\//g, '') || options.db;
    }
    else {
      options.user = (args && args.user) || options.user;
      options.pass = (args && args.pass) || options.pass;
      options.host = (args && args.host) || options.host;
      options.port = (args && args.port) || options.port;
      options.datastore_endpoint =
        (args && args.datastore_endpoint) || options.datastore_endpoint;
      options.kvquery_endpoint =
        (args && args.kvquery_endpoint) || options.kvquery_endpoint;
//      options.db   = args && args.db   || options.db;
    }
    return options;
  }
  
 /*
  * Set Nuvem options
  *
  * E.g.:
  *    db.options.set('test', value) // sets the value of 'test'
  *
  * @param {String} key
  * @param {String} value
  *
  * @return The value
  */
  function setOption(key, value) { 
    options[key] = value;
    return value;
  }
  
 /*
  * Get Nuvem options
  *
  * E.g.:
  *    db.options.get('test') // returns the value of 'test'
  *
  * @param {String} key
  *
  * @return The value
  */
  function getOption(key) {
    return options[key];
  }
  
 /*
  * JSON URI
  *
  * The URI of a json document in the datastore given a uri
  *
  * @param {uri} The URI of the document
  *
  * @return The URL of the json document
  */
  function jsonUri(uri) {
    return ("http://" + options.host + ':' + options.port +
            "/" + options.datastore_endpoint + "/" + 
            uri.replace(/^\/(.*)/, "$1")); // If it starts with "/" remove leading "/"
  }
  
 /*
  * The URI of the JSON KV Query
  *
  * @return The URL of the KV Query Endpoint
  */
  function jsonKVQueryUri() {
    return ("http://" + options.host + ':' + options.port +
            "/" + options.kvquery_endpoint);
  }

 /*
  * Store a JSON Document
  * 
  * Stores a document from the database
  *
  * FIXME: I don't store properties, qualities or permissions
  *
  * @error {CONNREFUSED} When we can't connect to MarkLogic
  * @error {DOCMALFORMED} If the document is marlformed
  * @error {DOCSTOREFAILED} There was an internal server error
  *
  * @param {uri} The document uri
  * @param {document} The JSON document you want to store
  * @param {verb} Either PUT or POST, depending if it's an insert or update
  * @param {opts} Allow you to define quality, permissions and collections
  *
  * @return undefined
  */
  function storeJSON(uri,document,verb,opts,callback) {
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    // User got this wrong let's try and fix it
    if(typeof document === "string") {
      try {
        document = JSON.parse(document);
      } catch (e) {
        return callback(err.jsonError("Malformed UTF-8 JSON", "DOCMALFORMED"));
      }
    }
    var paramsFromOpts = qs.stringify(opts);
    var req = 
      { uri: jsonUri(uri) + (paramsFromOpts !== "" ? ("?" + paramsFromOpts) : "")
      , method: verb
      , body: JSON.stringify(document)
      };
    request(req, function storeJSONCb(e,resp,body) {
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode === 500) {
        return callback(err.jsonError("Unknown Error", "DOCSTOREFAILED")); }
      return callback();
    });
  }

 /*
  * Get a JSON Document
  * 
  * Retrieves a document from the database
  *
  * e.g. 
  *   db.json.get("a", function (err, document ) {
  *     if(err) throw err;
  *     return document;
  *   });
  *
  * @error {CONNREFUSED} When we can't connect to MarkLogic
  * @error {DOCNOTFOUND} If the document is not found
  * @error {DOCMALFORMED} Document is malformed
  *
  * @param {uri} The document uri
  *
  * @return The JSON document that was stored in the database
  */
  function getJSON(uri,callback) {
    var get = 
      { uri: jsonUri(uri)
      , method: "GET"
      };
    request(get, function getJSONCb(e,resp,body) {
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode === 404) {
        return callback(err.jsonError("Document not found", "DOCNOTFOUND")); }
      try {
        var jsonBody = JSON.parse(body);
        return callback(null,jsonBody);
      } 
      catch(exc) { callback(err.jsonError(exc, "DOCMALFORMED")); }
    });
  }
  
 /*
  * Deletes a JSON Document
  * 
  * Deletes a document from the database
  *
  * e.g. 
  *   db.json.delete("a", function (err, document ) {
  *     if(err) throw err;
  *     return document;
  *   });
  *
  * @error {CONNREFUSED} When we can't connect to MarkLogic
  * @error {DOCDELFAILED} If the delete failed
  * @error {DOCNOTFOUND} If the document is not found
  *
  * @param {uri} The document uri
  *
  * @return undefined
  */
  function deleteJSON(uri,callback) {
    var del = { uri: jsonUri(uri)
              , method: "DELETE"
              };
    request(del, function deleteJSONCb(e,resp,body) {
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode === 404) {
        return callback(err.jsonError("Document not found", "DOCNOTFOUND")); }
      if (resp.statusCode === 500) {
        return callback(err.jsonError("Unknown Error", "DOCDELFAILED")); }
      return callback();
    });
  }
  
 /*
  * Insert a new JSON document
  *
  * e.g. 
  *   db.json.insert("a", {"myFirstJSON": true}, 
  *     function (err) {
  *       if(err) throw err;
  *       console.log("yey");
  *   });
  *
  * @see storeJSON
  */ 
  function insertJSON(uri,document,opts,callback){
    storeJSON(uri,document,"PUT",opts,callback);
  }

 /*
  * Update a JSON document
  *
  * This function will update a JSON file if the file is present in the
  * datastore. If the file is not present this will simply update the files
  * properties
  *
  * e.g. 
  *   db.json.update("a", {"myFirstJSON": true}, 
  *     function (err) {
  *       if(err) throw err;
  *       console.log("yey");
  *   });
  *
  * @see storeJSON
  */ 
  function updateJSON(uri,document,opts,callback){
    storeJSON(uri,document,"POST",opts,callback);
  }

 /*
  * Find JSON documents that match the given properties
  *
  * No opts will use whatever is the default of the REST API.
  * If you are looking for info on the default behavior of this functionality
  * please refer to the REST API as this driver does not enforce it's own 
  * defaults
  *
  * You can either use an index for fetch or start/end for pagination
  *
  * e.g. var login = "dscape";
  *      db.json.find(
  *        { github: login
  *        , twitter: login 
  *        },
  *        { start: 1
  *        , end: 10
  *        },
  *        function userInDbCb(err,response) {
  *          if(err) {
  *            console.log(err); 
  *            return;
  *          }
  *          var userFromDb = response.results[0];
  *          console.log(userFromDb);
  *      });
  *
  * @error {CONNREFUSED} When we can't connect to MarkLogic
  * @error {FINDERROR} MarkLogic returned a non 200 http response
  *
  * @param {kvpairs} The values you want matched
  * @param {opts} The options, either index or start/end
  *
  * @return A JSON file containing outputs in the "results" property
  */
  function findJSON(kvpairs, opts, callback) {
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    var index = opts.index
      , start = opts.start
      , end   = opts.end
      , paramsFromOpts = qs.stringify(kvpairs)
      , params = (paramsFromOpts !== "" ? ("?" + paramsFromOpts) : "")
      , kvquery_uri;
    if(index) {
      kvquery_uri = jsonKVQueryUri() + "/" + index + "/" + params;
    }
    else if(start && end) {
      kvquery_uri = jsonKVQueryUri() + "/" + start + "/" + end + "/" + params;
    }
    else {
      kvquery_uri = jsonKVQueryUri() + params;
    }
    var get = 
      { uri: kvquery_uri
      , method: "GET"
      };
    request(get, function findJSONCb(e,resp,body){
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode !== 200) {
        return callback(err.socketError("Internal Server Error", "FINDERROR")); }
      return callback(null,JSON.parse(body));
    });
  }
 /*
  * Alias for findJSON(kvpairs, {index: 1}, callback)
  *
  * @param {kvpairs} The values you want matched
  *
  * @see findJSON
  */
  function firstJSON(kvpairs, callback) {
    findJSON(kvpairs, {index:1}, callback);
  }

  // Configure according to default values
  configureNuvem(args);

  // What is publically accessible
  return { "options":   { "current": config
                        , "set": setOption
                        , "get": getOption
                        }
         , "configure": configureNuvem
         , "json":      { "get": getJSON
                        , "insert": insertJSON
                        , "update": updateJSON
                        , "delete": deleteJSON
                        , "find": findJSON
                        , "first": firstJSON
                        }
         };
};

exports.version = version;
exports.path     = __dirname;