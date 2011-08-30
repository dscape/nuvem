var util = require('./util')
  , _    = require('underscore');

module.exports = exports = function uris_module(config) {
  var cfg              = _.clone(config)
    , public_functions = {};

 /*
  * returns the credentials part of the url
  *
  * @return credentials in format {user}:{pass}@, or empty string
  */
  function credentials() {
    if (cfg.user && cfg.pass) {
      return cfg.user + ":" + cfg.pass + "@";
    }
    return "";
  }

 /*
  * json document uri
  *
  * @param {filename:string} document file name
  * @param {opts:object:optional} collections, permissions and quality
  *
  * @return the full url of the json document
  */
  function json_document_uri(filename,opts) {
    opts = opts || {};
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
              "/" + cfg.json.store + "/" + 
              filename.replace(/^\/(.*)/, "$1") + // if it starts with "/" remove leading "/"
              util.qs_stringify(opts)
           ); 
  }
 
 /*
  * xml document uri
  *
  * @param {filename:string} document file name
  * @param {opts:object:optional} collections, permissions and quality
  *
  * @return the full url of the json document
  */
  function xml_document_uri(uri,opts) {
    opts = opts || {};
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
              "/" + cfg.xml.store + "/" + 
              uri.replace(/^\/(.*)/, "$1") + // if it starts with "/" remove leading "/"
              util.qs_stringify(opts)
           ); 
  }
  
 /*
  * json kv query uri
  *
  * @param {kvpairs:object} kvpairs you want to search on
  * @param {opts:object:optional} index, start and end
  *
  * @return the url of the kv endpoint
  */
  function json_kv_uri(kvpairs,opts) {
    var query = {key: [], value: []};
    opts      = opts    || {};
    kvpairs   = kvpairs || {};
    query     = _.extend(_.foldl(_.keys(kvpairs), function (memo,e) { 
      memo.key.push(e); memo.value.push(kvpairs[e]); return memo; }, query),
    opts);
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.json.kv + util.qs_stringify(query));
  }

 /*
  * xml kv query uri
  *
  * @param {kvpairs:object} kvpairs you want to search on
  * @param {opts:object:optional} index, start and end
  *
  * @return the url of the kv endpoint
  */
  function xml_kv_uri(kvpairs,opts) {
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
  * json qs query uri
  *
  * @param {q:string} query string
  *  
  * @return url of the query string endpoint
  */
  function json_qs_uri(q) {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.json.qs + "?q=" + encodeURI(q));
  }
  
 /*
  * xml qs query uri
  *
  * @param {q:string} query string
  *  
  * @return url of the query string endpoint
  */
  function xml_qs_uri(q) {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.xml.qs + "?q=" + encodeURI(q));
  }

 /*
  * info service uri
  *
  * @return uri of the info service
  */
  function info() {
    return ("http://" + credentials(cfg) + cfg.host + ':' + cfg.port +
            "/" + cfg.manage.info);
  }

  public_functions = { json: { store: json_document_uri
                             , kv: json_kv_uri
                             , qs: json_qs_uri
                             }
                     , xml: { store: xml_document_uri
                            , kv: xml_kv_uri
                            , qs: xml_qs_uri
                            }
                     , manage: { info: info }
                     };

  return public_functions;
};