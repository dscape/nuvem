var request     = require('request')
  , _           = require('underscore')
  , err         = require('./error')
  , uris_module = require('./uris');

module.exports = exports = function XmlModule(config) {
  var current   = _.clone(config)
    , urls      = uris_module(config) // Regenerate modules with new config
    , public_functions = {};
  
 /*
  * Store a XML Document
  * 
  * Stores a document from the database
  *
  * @error {CONNREFUSED} When we can't connect to MarkLogic
  * @error {DOCMALFORMED} If the document is marlformed
  * @error {DOCSTOREFAILED} There was an internal server error
  * @error {DOCSTOREAUTHFAILED} Authentication failed
  * @erro {DOCMALFORMED} Malformed XML Document
  *
  * @param {uri} The document uri
  * @param {document} The XML document you want to store
  * @param {verb} Either PUT or POST, depending if it's an insert or update
  * @param {opts} Allow you to define quality, permissions and collections
  *
  * @return undefined
  */
  function storeXML(uri,document,verb,opts,callback) {
    // If there is no callback create a do nothing callback
    if(!opts) {
      callback = function() { return; };
      opts     = {};
    }
    else if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    // Fix for MarkLogic Server Problem with empty PUT/POSTs
    if(document === ""){
      callback(err.xmlError("Malformed UTF-8 XML", "DOCMALFORMED"));
      return;
    }
    var req = 
      { uri: urls.xml.store(uri,opts,current)
      , method: verb
      , body: document
      };
    request(req, function storeXMLCb(e,resp,body) {
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return;
      }
      if (resp.statusCode === 400) {
        callback(err.xmlError("Malformed UTF-8 XML", "DOCMALFORMED"));
        return;
      }
      if (resp.statusCode === 500) {
        callback(err.xmlError("Unknown Error", "DOCSTOREFAILED"));
        return;
      }
      if(resp.statusCode === 401) {
        callback(err.xmlError("Authentication failed", "DOCSTOREAUTHFAILED"));
        return;
      }
      callback();
      return;
    });
  }
 
 /*
  * Get a XML Document
  * 
  * Retrieves a document from the database
  *
  * e.g. 
  *   db.xml.get("a", function (err, document ) {
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
  * @return The XML document that was stored in the database
  */
  function getXML(uri,callback) {
    var get = 
      { uri: urls.xml.store(uri,{},current)
      , method: "GET"
      };
    request(get, function getXMLCb(e,resp,body) {
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return; 
      }
      if (resp.statusCode === 404) {
        callback(err.xmlError("Document not found", "DOCNOTFOUND"));
        return;
      }
      if(resp.statusCode === 401) {
        callback(err.xmlError("Authentication failed", "DOCGETAUTHFAILED"));
        return;
      }
      try {
        callback(null,body);
        return;
      } 
      catch(exc) {
        callback(err.xmlError(exc, "DOCMALFORMED"));
        return;
      }
    });
  }
  
 /*
  * Deletes a XML Document
  * 
  * Deletes a document from the database
  *
  * e.g. 
  *   db.xml.delete("a");
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
  function deleteXML(uri,callback) {
    // If there is no callback just return a function that simply returns as callback
    if(!callback) {
      callback = function() { return; };
    }
    var del = { uri: urls.xml.store(uri,{},current)
              , method: "DELETE"
              };
    request(del, function deleteXMLCb(e,resp,body) {
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return;
      }
      if (resp.statusCode === 404) {
        callback(err.xmlError("Document not found", "DOCNOTFOUND"));
        return;
      }
      if(resp.statusCode === 401) {
        callback(err.xmlError("Authentication failed", "DOCDELAUTHFAILED"));
        return;
      }
      if (resp.statusCode === 500) {
        callback(err.xmlError("Unknown Error", "DOCDELFAILED"));
        return;
      }
      callback();
      return;
    });
  }
  
 /*
  * Insert a new XML document
  *
  * e.g. 
  *   db.xml.insert("a", "<a>test</a>", 
  *     function (err) {
  *       if(err) throw err;
  *       console.log("yey");
  *   });
  *
  * @see storeXML
  */ 
  function insertXML(uri,document,opts,callback){
    storeXML(uri,document,"PUT",opts,callback);
  }
 
 /*
  * Update a XML document
  *
  * This function will update a XML file if the file is present in the
  * datastore. If the file is not present this will simply update the files
  * properties
  *
  * e.g. 
  *   db.xml.update("a", "<changed>Yeah</changed>");
  *
  * @see storeXML
  */ 
  function updateXML(uri,document,opts,callback){
    storeXML(uri,document,"POST",opts,callback);
  }
 
 /*
  * Find XML documents that match the given properties
  *
  * No opts will use whatever is the default of the REST API.
  * If you are looking for info on the default behavior of this functionality
  * please refer to the REST API as this driver does not enforce it's own 
  * defaults
  *
  * You can either use an index for fetch or start/end for pagination
  *
  * e.g. var login = "dscape";
  *      db.xml.find(
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
  * @return A XML file containing outputs in the "results" property
  */
  function findXML(query, opts, callback) {
    var url;
    if(typeof query === "string") {
      url = urls.xml.qs(query,opts,current);
    }
    else if(typeof query === "object") {
      url = urls.xml.kv(query,opts,current);
    }
    else {
      callback(err.paramsError("Please provide either a string or a kv object", "INVALID_QUERY"));
      return;
    }
    if (typeof opts === 'function') {
     callback = opts;
     opts = {};
    }
    request.get(url, function findXMLCb(e,resp,body){
      if(e) {
        return callback(err.socketError(e, "CONNREFUSED")); }
      if (resp.statusCode !== 200) {
        return callback(err.internalError("Internal Server Error", "FINDERROR")); 
      }
      return callback(null,body);
    });
  }

 /*
  * Alias for findXML(query, {index: n}, callback)
  *
  * @param {query} The values you want matched
  *
  * @see findXML
  */
  function findNthXML(n, query, callback) {
    findXML(query, {index:n}, callback);
  }

 
 /*
  * Alias for findXML(query, {index: 1}, callback)
  *
  * @param {query} The values you want matched
  *
  * @see findXML
  */
  function firstXML(query, callback) {
    findXML(query, {index:1}, callback);
  }

  public_functions = { "get": getXML
                     , "insert": insertXML
                     , "update": updateXML
                     , "delete": deleteXML
                     , "find": findXML
                     , "first": firstXML
                     , "nth": findNthXML
                     };

  return public_functions;
};