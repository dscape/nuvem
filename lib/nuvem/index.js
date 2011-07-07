/**
 * Nuvem constructor
 *
 * @api public
 */
function Nuvem () {
  this.options = {};
  this.defaultConnection(); // default connection
};

/**
 * Configures a Connection instance.
 *
 * Examples:
 *
 *    db = nuvem.configureConnection('http://usr:pwd@host:port/db');
 *    // Will only change the setting you provide, rest remains the same
 *    // Check defaultConnection for the defaults
 *    db = nuvem.configureConnection({
 *      database: "Sample",
 *      username: "admin",
 *      password: "admin"
 *    });
 *
 * @param {JSON} Either the URL or a JSON object with params you want to alter
 * @return {Connection} The altered Connection object
 * @api public
 */

/**
 * Set Nuvem options
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

/**
 * Get Nuvem options
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