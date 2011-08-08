var url     = require('url')
  , _       = require('underscore')
  , config  = require('../../config/marklogic')
  , json    = require('./json');

/*
 * Nuvem Module
 *
 * e.g. var nuvem = require('nuvem');
 *      var db    = nuvem('http://user:pass@localhost:123');
 */
module.exports = exports = function NuvemModule(args) {
  var current          = _.clone(config)
    , public_functions = {};

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
      current.user = (parsedUrl.auth && parsedUrl.auth.split(':')[0]) || current.user;
      current.pass = (parsedUrl.auth && parsedUrl.auth.split(':')[1]) || current.pass;
      current.host = parsedUrl.hostname || current.host;
      current.port = parsedUrl.port     || current.port;
// We dont support multiple databases for now
//        current.db   = parsedUrl.pathname && parsedUrl.pathname.replace(/\//g, '') || current.db;
    }
    else { 
      current.user = (args && args.user) || current.user;
      current.pass = (args && args.pass) || current.pass;
      current.host = (args && args.host) || current.host;
      current.port = (args && args.port) || current.port;
      current.json.store =
        (args && args.jsonstore) || current.json.store;
      current.json.kv =
        (args && args.jsonkv) || current.json.kv;
      current.json.qs =
        (args && args.jsonqs) || current.json.qs;
//      current.db   = args && args.db   || current.db;
    }
    // Reload modules based on new configuration
    public_functions.json = json(current);
    return current;
  }
  
 /*
  * Set Nuvem options
  *
  * E.g.:
  *    db.options.set('test', value) // sets the value of 'test'
  *
  * @param {String} key
  * @param {String} value
  *
  * @return The value
  */
  function setOption(key, value) { 
    current[key] = value;
    return value;
  }
  
 /*
  * Get Nuvem options
  *
  * E.g.:
  *    db.options.get('test') // returns the value of 'test'
  *
  * @param {String} key
  *
  * @return The value
  */
  function getOption(key) {
    return current[key];
  }

  // Configure according to default values
  configureNuvem(args);

  // What is publically accessible
  public_functions = { "options":   { "current": current
                                    , "original": config
                                    , "set": setOption
                                    , "get": getOption
                                    }
                     , "configure": configureNuvem
                     , "json":      json(current)
                     };

  return public_functions;
};