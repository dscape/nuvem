var url = require('url');

/*
 * Nuvem Module
 *
 */
module.exports = exports = function Nuvem(args) {
  var options   = {};
  options.user  = 'admin';
  options.pass  = 'admin';
  options.host  = '127.0.0.1';
  options.port  = '5015';
  options.db    = 'Documents';
  var functions = {
    options: options,
    /*
     * Configures the access to MarkLogic.
     *
     * Examples:
     *
     *    nuvem.configure('http://user:pass@host:123/db');
     *    // > { user: 'user', pass: 'pass', host: 'host', port: '123', db: 'db' }
     *    // Will only change the setting you provide - rest remains unaltered
     *    nuvem.configure({
     *      db: "Sample",
     *      user: "admin",
     *      pass: "admin"
     *    });
     *    // > { user: 'admin', pass: 'admin', host: 'host', port: '123', db: 'Sample' }
     *
     * @param {params} Either the URL or a JSON object with params you want to alter
     * @return {Configuration} The altered options object
     */
    configure: function nuvemConfigure(args) {
      if (typeof args === 'string') {
        var parsedUrl = url.parse(args,false);
        options.user = parsedUrl.auth && parsedUrl.auth.split(':')[0] || options.user;
        options.pass = parsedUrl.auth && parsedUrl.auth.split(':')[1] || options.pass;
        options.host = parsedUrl.hostname || options.host;
        options.port = parsedUrl.port     || options.port;
        options.db   = parsedUrl.pathname && parsedUrl.pathname.replace(/\//g, '') || options.db;
      }
      else {
        options.user = args && args.user || options.user;
        options.pass = args && args.pass || options.pass;
        options.host = args && args.host || options.host;
        options.port = args && args.port || options.port;
        options.db   = args && args.db   || options.db;
      }
      return options;
    },
    /*
     * Set Nuvem options
     *
     * E.g.:
     *    nuvem.set('test', value) // sets the value of 'test'
     *
     * @param {String} key
     * @param {String} value
     */
    set: function nuvemSet(key, value) { 
      options[key] = value;
      return value;
    },
    /*
     * Get Nuvem options
     *
     * E.g.:
     *    nuvem.get('test') // returns the value of 'test'
     *
     * @param {String} key
     */
    get: function nuvemGet(key) {
      return options[key];
    }
  };
  functions.configure(args);
  return functions;
};

exports.version = '0.0.1';
