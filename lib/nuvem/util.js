var qs = require('./querystring')
    _  = require('underscore');

/*
 * Creates the strigified version of a flat json file
 *
 * e.g. qs_stringify({a:false, b: true}) -> "?a=false&b=true"
 *      qs_stringify({})        -> ""
 *
 * @param {opts} The JSON file
 *
 * @return A string containing the query string
 */
function qs_stringify(opts) {
  if(typeof opts === "object" && !_.isEmpty(opts)) { 
    return "?" + qs.stringify(opts);
  }
  else {
    return ""; 
  }
}

exports.qs_stringify = qs_stringify;