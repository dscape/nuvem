var url     = require('url')
  , config  = require('../../config/marklogic')
  , version = require('../../package.json').version;

/*
 * Nuvem Module
 */
module.exports = exports = function Nuvem(args) {
  var options   = config;

 /*
  * Configures the access to MarkLogic.
  *
  * Examples:
  *
  *    nuvem.configure('http://user:pass@host:123');
  *    // > { user: 'user', pass: 'pass', host: 'host', port: '123' }
  *    // Will only change the setting you provide - rest remains unaltered
  *    nuvem.configure({
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
      options.db   = args && args.db   || options.db;
    }
    return options;
  };
  
 /*
  * Set Nuvem options
  *
  * E.g.:
  *    nuvem.set('test', value) // sets the value of 'test'
  *
  * @param {String} key
  * @param {String} value
  */
  function setOption(key, value) { 
    options[key] = value;
    return value;
  };
  
 /*
  * Get Nuvem options
  *
  * E.g.:
  *    nuvem.get('test') // returns the value of 'test'
  *
  * @param {String} key
  */
  function getOption(key) {
    return options[key];
  };

  configureNuvem(args);

  return { options: config
         , configure: configureNuvem
         , set: setOption
         , get: getOption
         };
};

exports.version = version;