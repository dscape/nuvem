var url     = require('url')
  , request = require('request')
  , _       = require('underscore')
  , config  = require('../../config/marklogic')
  , err     = require('./error')
  , urls    = require('./uris')
  , version = "0.0.3";

/*
 * Nuvem Module
 *
 * e.g. var nuvem = require('nuvem');
 *      var db    = nuvem('http://user:pass@localhost:123');
 */
module.exports = exports = function Nuvem(args) {
  var current   = _.clone(config);

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
      current.user = (parsedUrl.auth && parsedUrl.auth.split(':')[0]) || current.user;
      current.pass = (parsedUrl.auth && parsedUrl.auth.split(':')[1]) || current.pass;
      current.host = parsedUrl.hostname || current.host;
      current.port = parsedUrl.port     || current.port;
// We dont support multiple databases for now
//        current.db   = parsedUrl.pathname && parsedUrl.pathname.replace(/\//g, '') || current.db;
    }
    else { 
      current.user = (args && args.user) || current.user;
      current.pass = (args && args.pass) || current.pass;
      current.host = (args && args.host) || current.host;
      current.port = (args && args.port) || current.port;
      current.json.store =
        (args && args.jsonstore) || current.json.store;
      current.json.kv =
        (args && args.jsonkv) || current.json.kv;
      current.json.qs =
        (args && args.jsonqs) || current.json.qs;
//      current.db   = args && args.db   || current.db;
    }
    return current;
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
    current[key] = value;
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
    return current[key];
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
  * @error {DOCSTOREAUTHFAILED} Authentication failed
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
        callback(err.jsonError("Malformed UTF-8 JSON", "DOCMALFORMED"));
        return;
      }
    }
    var req = 
      { uri: urls.json.store(uri,opts,current)
      , method: verb
      , body: JSON.stringify(document)
      };
    request(req, function storeJSONCb(e,resp,body) {
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return;
      }
      if (resp.statusCode === 500) {
        callback(err.jsonError("Unknown Error", "DOCSTOREFAILED"));
        return;
      }
      if(resp.statusCode === 401) {
        callback(err.jsonError("Authentication failed", "DOCSTOREAUTHFAILED"));
        return;
      }
      callback();
      return;
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
  * @error {DOCGETAUTHFAILED} Authentication failed
  *
  * @param {uri} The document uri
  *
  * @return The JSON document that was stored in the database
  */
  function getJSON(uri,callback) {
    var get = 
      { uri: urls.json.store(uri,{},current)
      , method: "GET"
      };
    request(get, function getJSONCb(e,resp,body) {
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return; 
      }
      if (resp.statusCode === 404) {
        callback(err.jsonError("Document not found", "DOCNOTFOUND"));
        return;
      }
      if(resp.statusCode === 401) {
        callback(err.jsonError("Authentication failed", "DOCGETAUTHFAILED"));
        return;
      }
      try {
        var jsonBody = JSON.parse(body);
        callback(null,jsonBody);
        return;
      } 
      catch(exc) {
        callback(err.jsonError(exc, "DOCMALFORMED"));
        return;
      }
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
  * @error {DOCDELAUTHFAILED} Authentication failed
  *
  * @param {uri} The document uri
  *
  * @return undefined
  */
  function deleteJSON(uri,callback) {
    var del = { uri: urls.json.store(uri,{},current)
              , method: "DELETE"
              };
    request(del, function deleteJSONCb(e,resp,body) {
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return;
      }
      if (resp.statusCode === 404) {
        callback(err.jsonError("Document not found", "DOCNOTFOUND"));
        return;
      }
      if(resp.statusCode === 401) {
        callback(err.jsonError("Authentication failed", "DOCDELAUTHFAILED"));
        return;
      }
      if (resp.statusCode === 500) {
        callback(err.jsonError("Unknown Error", "DOCDELFAILED"));
        return;
      }
      callback();
      return;
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
    var get = 
      { uri: urls.json.kv(kvpairs,opts,current)
      , method: "GET"
      };
    request(get, function findJSONCb(e,resp,body){
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode !== 200) {
        return callback(err.socketError("Internal Server Error", "FINDERROR")); 
      }
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
  return { "options":   { "current": current
                        , "original": config
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