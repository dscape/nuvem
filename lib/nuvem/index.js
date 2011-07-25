var url     = require('url')
  , request = require('request')
  , config  = require('../../config/marklogic')
  , err     = require('./error')
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
      options.user = parsedUrl.auth && parsedUrl.auth.split(':')[0] || options.user;
      options.pass = parsedUrl.auth && parsedUrl.auth.split(':')[1] || options.pass;
      options.host = parsedUrl.hostname || options.host;
      options.port = parsedUrl.port     || options.port;
// We dont support multiple databases for now
//        options.db   = parsedUrl.pathname && parsedUrl.pathname.replace(/\//g, '') || options.db;
    }
    else {
      options.user = args && args.user || options.user;
      options.pass = args && args.pass || options.pass;
      options.host = args && args.host || options.host;
      options.port = args && args.port || options.port;
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
  function jsonUri(uri){
    return "http://" + options.host + ':' + options.port 
         + "/" + options.datastore_endpoint + "/" + uri;
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
  *
  * @param {uri} The document uri
  *
  */
  function getJSON(uri,callback) {
    var get = 
      { uri: jsonUri(uri)
      , method: "GET"
      };
    request(get, function getJSONCb(e,resp,body) {
      if(e) 
        return callback(err.socketError(e, "CONNREFUSED"));
      if (resp.statusCode === 404)
        return callback(err.jsonError("Document not found", "DOCNOTFOUND"));
      return callback(null,body);
    });
  }

 /*
  * Store a JSON Document
  * 
  * Stores a document from the database
  *
  * e.g. 
  *   db.json.insert("a", {"myFirstJSON": true}, 
  *     function (err) {
  *       if(err) throw err;
  *       console.log("yey");
  *   });
  *
  * @error {CONNREFUSED} When we can't connect to MarkLogic
  * @error {DOCMALFORMED} If the document is marlformed
  * @error {SERVERERROR} There was an internal server error
  *
  * @param {uri} The document uri
  * @param {document} The JSON document you want to store
  *
  */
  function insertJSON(uri,document,callback) {
    if(typeof document === "string") {
      try {
        document = JSON.parse(document);
      } catch (e) {
        return callback(err.jsonError("Malformed UTF-8 JSON", "DOCMALFORMED"));
      }
    }
    var put = 
      { uri: jsonUri(uri)
      , method: "PUT"
      , body: JSON.stringify(document)
      };
    request(put, function getJSONCb(e,resp,body) {
      if(e) 
        return callback(err.socketError(e, "CONNREFUSED"));
      if (resp.statusCode === 500)
        return callback(err.jsonError("Unknown Error", "SERVERERROR"));
      return callback();
    });
  }

  configureNuvem(args);
  return { options:   { current_options: config
                      , set: setOption
                      , get: getOption
                      }
         , configure: configureNuvem
         , json:      { get: getJSON
                      , insert: insertJSON
                      }
         };
};

exports.version = version;