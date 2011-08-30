var _           = require('underscore')
  , request_module = require('./request')
  , err         = require('./error')
  , uris_module = require('./uris');

module.exports = exports = function manage_module(config) {
  var current   = _.clone(config)
    , urls      = uris_module(config) // regenerate modules with new config
    , request   = request_module(config)
    , public_functions = {};

 /*
  * returns information about the server version, 
  * hardware and index settings, and more...
  *
  * @param {callback:function:optional} function to call back
  *
  * @return json information regarding the service
  */
  function get_info(callback) {
    request.get(urls.manage.info(), callback);
  }

  public_functions = { "info": get_info };

  return public_functions;
};