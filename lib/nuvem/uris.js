var cfg     = require('../../config/marklogic')
  , util    = require('./util');

/*
 * JSON URI
 *
 * The URI of a json document in the datastore given a uri
 *
 * @param {uri} The URI of the document
 * @param {opts} Collections, Permissions and Quality
 * @param {cfg} The contents of the config file from config/
 *
 * @return The URL of the json document
 */
 function jsonStore(uri, opts) {
   return ("http://" + cfg.host + ':' + cfg.port +
             "/" + cfg.json.store + "/" + 
             uri.replace(/^\/(.*)/, "$1") + // If it starts with "/" remove leading "/"
             util.qs_stringify(opts)
          ); 
 }
 
/*
 * The URI of the JSON KV Query
 *
 * @param {opts} index, start and end in a json object
 * @param {kvpairs} The kvpairs you want to search on
 * @param {cfg} The contents of the config file from config/
 *
 * @return The URL of the KV Query Endpoint
 */
 function jsonKV(kvpairs, opts) {
   var sub_path = ""
     , index = opts && opts.index
     , start = opts && opts.start
     , end   = opts && opts.end;
   if(index) {
     sub_path = "/" + index;
   }
   else if(start && end) {
     sub_path = "/" + start + "/" + end;
   }
   return ("http://" + cfg.host + ':' + cfg.port +
           "/" + cfg.json.kv + sub_path + util.qs_stringify(kvpairs));
 }

/*
 * The URI of the JSON query string service
 *
 * @param {cfg} The contents of the config file from config/
 *
 * @return The URL of the Query String Endpoint
 */
 function jsonQS(q) {
   return ("http://" + cfg.host + ':' + cfg.port +
           "/" + cfg.json.qs + "?q=" + encodeURI(q));
 }

module.exports = 
  { json:
    { store: jsonStore
    , kv: jsonKV
    , qs: jsonQS
    }
  };