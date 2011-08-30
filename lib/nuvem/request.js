var request = require('request')
  , _       = require('underscore')
  , err     = require('./error');

module.exports = exports = function request_module(config) {
  var cfg              = _.clone(config)
    , public_functions = {};

  if(cfg.proxy) {
    request = request.defaults({proxy: opts.proxy});
  }

 /*
  * json
  *
  * base for all json requests using nuvem
  *
  * @error {socket:SOCKET} problem connecting to corona
  * @error {nuvem:STRINGIFY-REQUEST} couldn't stringify json object
  * @error {nuvem:PARSE-RESPONSE} couldn't stringify json object
  * @error {nuvem:NO-BODY} tried to put or post without a body
  * @error {corona:*} an error proxied from corona
  *
  * @param {opts.uri:string} The URL to request
  *        {opts.method:string:optional} http method, defaults to "GET"
  *        {opts.body:object|string|binary:optional} document or binary body
  *        {opts.proxy:string:optional} http proxy
  * @param {callback:function:optional} function to call back
  *
  * @return either the request stream (no callback) or the execution of the
  *   callback code
  */
  function json(opts,callback) {
    var headers = { 'content-type': 'application/json' }
      , req    = { method: (opts.method || "GET"), headers: headers, uri: opts.uri }
      , status_code
      , parsed
      , rh;
    if(!callback) { return request(req); }              // no callback, pipe
    if(opts.body) {
      if(typeof opts.body === "string") {
        req.body = opts.body;                           // corona might complain malformed
      }
      else {
        try { req.body = JSON.stringify(opts.body); }
        catch(exc) { return callback(err.nuvem(exc, "STRINGIFY-REQUEST")); }
      }
    }
    if((req.method === 'PUT' || req.method === 'POST') && !req.body) {
      return callback(err.nuvem("Can't make a put or a post without a body", "NO-BODY"));
    }
    request(req, function(e,h,b) {
      rh = (h && h.headers || {});
      rh['status-code'] = status_code = (h && h.statusCode || 500);
      if(e) { return callback(err.socket(e,'SOCKET',req,status_code),rh,b); }
      if(_.isEmpty(b)) { // return an empty object to avoid problems in clients
        parsed = {};
      }
      else {
        try { parsed = JSON.parse(b); } 
        catch (exc) { 
          exc.message = exc.message + ' on json ' + b; // improve error quality
          return callback(err.nuvem(exc,"PARSE-RESPONSE",req,status_code),rh,b); 
        }
      }
      if (status_code >= 200 && status_code < 300) {
        callback(null,rh,parsed);
      }
      else { // proxy the error from corona
        callback(err.corona(parsed.error.message,parsed.error.code,req,status_code),rh,b);
      }
    });
  }
 
 /*
  * xml
  *
  * base for all xml requests using nuvem
  *
  * @error {socket:SOCKET} problem connecting to corona
  * @error {corona:*} an error proxied from corona
  *
  * @param {opts.uri:string} The URL to request
  *        {opts.method:string:optional} http method, defaults to "GET"
  *        {opts.body:object|string|binary:optional} document or binary body
  *        {opts.proxy:string:optional} http proxy
  *        {opts.encoding:string:optional} encoding
  * @param {callback:function:optional} function to call back
  *
  * @return either the request stream (no callback) or the execution of the
  *   callback code
  */
  function xml(opts,callback) {
    var headers = { 'content-type': 'application/xml' }
      , req    = { method: (opts.method || "GET"), headers: headers, uri: opts.uri }
      , status_code
      , parsed
      , rh;
    if(opts.proxy) {                                    // proxy support
      request = request.defaults({proxy: opts.proxy});
    }
    if(!callback) { return request(req); }              // no callback, pipe
    if(opts.body) { req.body = opts.body; }
    request(req, function(e,h,b){
      rh = (h && h.headers || {});
      rh['status-code'] = status_code = (h && h.statusCode || 500);
      if(e) { return callback(err.socket(e,'SOCKET',req,status_code),rh,b); }
      try { parsed = JSON.parse(b); } 
      catch (exc) { callback(err.nuvem(exc, "PARSE-REPONSE")); }
      if (status_code >= 200 && status_code < 300) {
        callback(null,rh,parsed);
      }
      else { // proxy the error from corona
        callback(error.corona(parsed.error.message,parsed.error.code,req,status_code),rh,b);
      }
    });
  }
 
 /*
  * binary
  *
  * base for all binary requests using nuvem
  *
  * @error {socket:socket} problem connecting to corona
  * @error {corona:corona} an error proxied from corona
  *
  * @param {opts.uri:string} The URL to request
  *        {opts.method:string:optional} http method, defaults to "GET"
  *        {opts.body:object|string|binary:optional} document or binary body
  *        {opts.proxy:string:optional} http proxy
  *        {opts.encoding:string:optional} encoding
  * @param {callback:function:optional} function to call back
  *
  * @return either the request stream (no callback) or the execution of the
  *   callback code
  */
  function binary(opts, callback) {
    var headers = { "content-type": ct }
      , req    = { method: (opts.method || "GET"), headers: headers, uri: opts.uri }
      , status_code
      , parsed
      , rh;
    if(opts.encoding && callback) {                     // set encoding
      req.encoding = opts.encoding;
      delete req.headers["content-type"];
      delete req.headers.accept;
    }
    if(opts.proxy) {                                    // proxy support
      request = request.defaults({proxy: opts.proxy});
    }
    if(!callback) { return request(req); }              // no callback, pipe
    if(opts.body) { 
      if (Buffer.isBuffer(opts.body)) {                 // binary
        req.body = opts.body;
      }
      else if(ct === 'application/json') {              // json?
          if(typeof opts.body === "string") {
            req.body = opts.body;                       // corona might complain malformed
          }
          else {
            try { req.body = JSON.stringify(opts.body); }
            catch(e) { return callback(err.nuvem("Not JSON", "NOT-JSON")); }
          }
      }
      else {
        req.body = opts.body;                           // xml
      }
    }
    if(!callback) { return request(req); }              // no callback, pipe
    request(req, function(e,h,b){
      rh = (h && h.headers || {});
      rh['status-code'] = status_code = (h && h.statusCode || 500);
      if(e) { return callback(err.socket(e,'socket',req,status_code),rh,b); }
      if (status_code >= 200 && status_code < 300) {
        if(ct === 'application/json') {                 // json?
          try { return callback(null,rh,JSON.parse(b)); } 
          catch (e2) { }
        }
        callback(null,rh,b);                            // binary? xml?
      }
      else { // proxy the error from corona
        callback(error.corona(b,'corona',req,status_code),rh,b);
      }
    });
  }

  public_functions = { json:   json
                     , xml:    xml
                     , binary: binary
                     };
  return public_functions;
};