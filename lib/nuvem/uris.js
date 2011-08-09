/*
 * Maintainers: There's a lot of code duplication here but it is intentional
 *
 * People can change their routes (and are expected to).
 * This is a easy place for a user to change them all at once. Nesting calls
 * would make this harder
 *
 */
var util        = require('./util');

module.exports = exports = function UrisModule(config) {
  var cfg              = _.clone(config)
    , public_functions = {};
 /*
  * Returns the credentials part of the url
  *
  * @return The credentials in format {user}:{pass}@, or empty string
  */
  function credentials() {
    if (cfg.user && cfg.pass) {
      return cfg.user + ":" + cfg.pass + "@";
    }
    return "";
  }

 /*
  * JSON URI
  *
  * The URI of a json document in the datastore given a uri
  *
  * @param {uri} The URI of the document
  * @param {opts} Collections, Permissions and Quality
  *
  * @return The URL of the json document
  */
  function jsonStore(uri, opts) {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
              "/" + cfg.json.store + "/" + 
              uri.replace(/^\/(.*)/, "$1") + // If it starts with "/" remove leading "/"
              util.qs_stringify(opts)
           ); 
  }
 
 /*
  * XML URI
  *
  * The URI of a XML document in the datastore given a uri
  *
  * @param {uri} The URI of the document
  * @param {opts} Collections, Permissions and Quality
  *
  * @return The URL of the XML document
  */
  function xmlStore(uri, opts) {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
              "/" + cfg.xml.store + "/" + 
              uri.replace(/^\/(.*)/, "$1") + // If it starts with "/" remove leading "/"
              util.qs_stringify(opts)
           ); 
  }
  
 /*
  * The URI of the JSON KV Query
  *
  * @param {opts} index, start and end in a json object
  * @param {kvpairs} The kvpairs you want to search on
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
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.json.kv + sub_path + util.qs_stringify(kvpairs));
  }

 /*
  * The URI of the XML KV Query
  *
  * @param {opts} index, start and end in a xml object
  * @param {kvpairs} The kvpairs you want to search on
  *
  * @return The URL of the KV Query Endpoint
  */
  function xmlKV(kvpairs, opts) {
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
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.xml.kv + sub_path + util.qs_stringify(kvpairs));
  }

 /*
  * The URI of the JSON query string service
  *
  * @return The URL of the Query String Endpoint
  */
  function jsonQS(q) {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.json.qs + "?q=" + encodeURI(q));
  }
  
 /*
  * The URI of the XML query string service
  *
  * @return The URL of the Query String Endpoint
  */
  function xmlQS(q) {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.xml.qs + "?q=" + encodeURI(q));
  }

 /*
  * The URI of the info service
  */
  function info() {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.manage.info);
  }

  public_functions = { json:
                       { store: jsonStore
                       , kv: jsonKV
                       , qs: jsonQS
                       }
                     , xml: 
                       { store: xmlStore
                       , kv: xmlKV
                       , qs: xmlQS
                       }
                     , manage:
                       { info: info }
                     };

  return public_functions;
}