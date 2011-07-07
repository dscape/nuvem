var url = require('url');

/*
 * Nuvem constructor
 *
 * @api public
 */
var Nuvem = function Nuvem(params) {
  this.options = {};
  this.defaults();
  this.configure(params);
};

/*
 * Sets options back to defaults
 *
 * Examples:
 *
 *    nuvem.defaults();
 *    // > { user: 'admin', pass: 'admin', host: '127.0.0.1', port: '5015', db: 'Documents' }
 *
 * @return {Configuration} The altered options object
 * @api public
 */
Nuvem.prototype.defaults = function () {
  this.options.user = 'admin';
  this.options.pass = 'admin';
  this.options.host = '127.0.0.1';
  this.options.port = '5015';
  this.options.db   = 'Documents';
  return this.options;
};

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
 * @api public
 */
Nuvem.prototype.configure = function (args) {
  if (typeof args === 'string') {
    var parsedUrl = url.parse(args,false);
    this.options.user = parsedUrl.auth && parsedUrl.auth.split(':')[0] || this.options.user;
    this.options.pass = parsedUrl.auth && parsedUrl.auth.split(':')[1] || this.options.pass;
    this.options.host = parsedUrl.hostname || this.options.host;
    this.options.port = parsedUrl.port     || this.options.port;
    this.options.db   = parsedUrl.pathname && parsedUrl.pathname.replace(/\//g, '') || this.options.db;
  }
  else {
    this.options.user = args && args.user || this.options.user;
    this.options.pass = args && args.pass || this.options.pass;
    this.options.host = args && args.host || this.options.host;
    this.options.port = args && args.port || this.options.port;
    this.options.db   = args && args.db   || this.options.db;
  }
  return this.options;
};

/*
 * Set other Nuvem options
 *
 * E.g.:
 *    nuvem.set('test', value) // sets the value of 'test'
 *
 * @param {String} key
 * @param {String} value
 * @api public
 */
Nuvem.prototype.set = function (key, value) { 
  this.options[key] = value;
  return this;
};

/*
 * Get other Nuvem options
 *
 * E.g.:
 *    nuvem.get('test') // returns the value of 'test'
 *
 * @param {String} key
 * @api public
 */
Nuvem.prototype.get = function (key) {
  return this.options[key];
};

module.exports = exports = new Nuvem();
exports.version = '0.0.1';
exports.Nuvem = Nuvem;
