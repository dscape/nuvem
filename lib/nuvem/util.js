var qs = require('./querystring')
    _  = require('underscore');

/*
 * creates the stringified query string version of a flat json object
 *
 * e.g. qs_stringify({a:false, b: true}) -> "?a=false&b=true"
 *      qs_stringify({})        -> ""
 *
 * @param {opts:object} the file to transform to query string
 *
 * @return the query string including ?
 */
function qs_stringify(opts) {
  opts = opts || {}; // make sure no one breaks us here
  if(typeof opts === "object" && !_.isEmpty(opts)) { 
    return "?" + qs.stringify(opts);
  }
  else {
    return ""; 
  }
}

exports.qs_stringify = qs_stringify;