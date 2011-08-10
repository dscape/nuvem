var request     = require('request')
  , _           = require('underscore')
  , err         = require('./error')
  , uris_module = require('./uris');

module.exports = exports = function JsonModule(config) {
  var current   = _.clone(config)
    , urls      = uris_module(config) // Regenerate modules with new config
    , public_functions = {};  
  
 /*
  * Store a JSON Document
  * 
  * Stores a document from the database
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
    // If there is no callback just return
    if(!opts) {
      callback = function() { return; };
      opts     = {};
    }
    else if (typeof opts === 'function') {
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
  *   db.json.delete("a", function (err) {
  *     if(err) throw err;
  *     return;
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
    // If there is no callback just return
    if(!callback) {
      callback = function() { return; };
    }
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
  * @error {INVALID_QUERY} The query was neither a string or a kv object
  *
  * @param {query} The value(s) you want matched. Either a string or an object
  * @param {opts} The options, either index or start/end
  *
  * @return A JSON file containing outputs in the "results" property
  */
  function findJSON(query, opts, callback) {
    var url;
    if(typeof query === "string") {
      url = urls.json.qs(query,opts,current);
    }
    else if(typeof query === "object") {
      url = urls.json.kv(query,opts,current);
    }
    else {
      callback(err.paramsError("Please provide either a string or a kv object", "INVALID_QUERY"));
      return;
    }
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    request.get(url, function findJSONCb(e,resp,body){
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode !== 200) {
        return callback(err.internalError("Internal Server Error", "FINDERROR")); 
      }
      var parsed_response = JSON.parse(body);
      // If we are returning only one result skip the encapsulation
      // And return that thing
      console.log(parsed_response.results[0])
      if(opts.index) {
        parsed_response = parsed_response.results[0]; 
      }
      return callback(null,parsed_response);
    });
  }

 /*
  * Alias for findJSON(query, {index: n}, callback).response.results[0]
  *
  * @param {query} The values you want matched
  *
  * @see findJSON
  */
  function findNthJSON(n, query, callback) {
    findJSON(query, {index: n}, callback);
  }

 /*
  * Alias for findJSON(query, {index: 1}, callback).response.results[0]
  *
  * @param {query} The values you want matched
  *
  * @see findJSON
  */
  function firstJSON(query, callback) {
    findJSON(query, {index:1}, callback);
  }

  public_functions = { "get": getJSON
                     , "insert": insertJSON
                     , "update": updateJSON
                     , "delete": deleteJSON
                     , "find": findJSON
                     , "first": firstJSON
                     , "nth": findNthJSON
                     };

  return public_functions;
};