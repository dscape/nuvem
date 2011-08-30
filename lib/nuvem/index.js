var url      = require('url')
  , _        = require('underscore')
  , defaults = require('../../cfg/defaults')
  , json     = require('./json')
  , xml      = require('./xml')
  , manage   = require('./manage');

/*
 * nuvem module
 *
 * e.g. var nuvem = require('nuvem');
 *      var db    = nuvem('http://user:pass@localhost:123');
 */
module.exports = exports = function nuvem_module(config) {
  var current          = _.clone(defaults)
    , public_functions = {};

 /*
  * configures the access to marklogic
  *
  * this function is cumulative, so it will only change things provided while
  * the rest remains unchanged
  *
  * e.g.
  *    db.configure('http://user:pass@host:123');
  *    // > { user: 'user', pass: 'pass', host: 'host', port: '123' }
  *    // will only change the setting you provide - rest remains unaltered
  *    db.configure({
  *      user: "admin",
  *      pass: "admin"
  *    });
  *    // > { user: 'admin', pass: 'admin', host: 'host', port: '123' }
  *
  * @param {args:object|string} either an object like cfg/defaults.cfg or a
  *   a string representing a url where corona is available
  *
  * @return {object} the altered options object
  */
  function configure(args) {
    if (typeof args === 'string') { 
      var parsed = url.parse(args,false)
        , auth   = parsed.auth;
      current.user = (auth && auth.split(':')[0]) || current.user;
      current.pass = (auth && auth.split(':')[1]) || current.pass;
      current.host = parsed.hostname              || current.host;
      current.port = parsed.port                  || current.port;
    }
    else {
      current.user       = (args && args.user)      || current.user;
      current.pass       = (args && args.pass)      || current.pass;
      current.host       = (args && args.host)      || current.host;
      current.port       = (args && args.port)      || current.port;
      current.json.store = (args && args.jsonstore) || current.json.store;
      current.json.kv    = (args && args.jsonkv)    || current.json.kv;
      current.json.qs    = (args && args.jsonqs)    || current.json.qs;
      current.xml.store  = (args && args.xmlstore)  || current.xml.store;
      current.xml.kv     = (args && args.xmlkv)     || current.xml.kv;
      current.xml.qs     = (args && args.xmlqs)     || current.xml.qs;
      if(args && args.proxy) {
        current.proxy    = args.proxy;
      }
    }
    // reload modules based on new configuration
    public_functions.json   = json(current);
    public_functions.xml    = xml(current);
    public_functions.manage = manage(current);
    return current;
  }

  // init
  configure(config);

  public_functions = { options:   { current: current
                                  , defaults: defaults
                                  }
                     , configure: configure
                     , json:      json(current)
                     , xml:       xml(current)
                     , manage:    manage(current)
                     };

  return public_functions;
};