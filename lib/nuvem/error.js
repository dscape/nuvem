/*
 * generic error
 * 
 * @param {scope:string} a namespace for the error, e.g. socket 
 * @param {error:error|string} the error or a reason for the error
 * @param {code:string} the recognizable error code
 * @param {request:object} the http request that was made
 * @param {status_code:integer:optional} the http status code
 *
 * @return an augmented error that helps you know more than the stack trace
 */
function gen_err(scope,error,code,request,status_code) {
  error       = error                                          || 'unknown';
  code        = code                                           || 'unknown';
  status_code = typeof status_code === "number" && status_code || 500;
  request     = request                                        || {};
  if(typeof error === 'string') { error = new Error(error); }
  if(scope === 'corona') {
    error.code = code;
  }
  else {
    error.code = scope + ':' + code;
  }  
  error["status-code"]  = status_code;
  error.scope        = scope;
  error.request      = request;
  //if(process.env.NODE_ENV!=="production") { console.error(JSON.stringify(error)); }
  return error;
}

exports.socket = function (e,c,r,s) { return gen_err('socket',e,c,r,s); };
exports.corona = function (e,c,r,s) { return gen_err('corona',e,c,r,s); };
exports.nuvem  = function (e,c,r,s) { return gen_err('nuvem',e,c,r,s);  };