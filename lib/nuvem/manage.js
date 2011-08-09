var request     = require('request')
  , _           = require('underscore')
  , err         = require('./error')
  , uris_module = require('./uris');

module.exports = exports = function ManageModule(config) {
  var current   = _.clone(config)
    , urls      = uris_module(config) // Regenerate modules with new config
    , public_functions = {};

 /*
  * Returns information about the server version, 
  * hardware and index settings, and more
  *
  * @error {CONNREFUSED} Problem with socket
  * @error {INFOERROR} Didn't return 200, likely you have a problem with your
  *        instalation. This should always work if the service is available
  *
  * @return JSON information regarding the service
  */
  function getInfo(callback) {
    request.get(urls.manage.info(), function infoCb(e,resp,body){
      if(e) {
        callback(err.socketError(e, "CONNREFUSED"));
        return;
      }
      if (resp.statusCode !== 200) {
        return callback(err.internalError("Internal Server Error", "INFOERROR")); 
      }
      return callback(null,JSON.parse(body));
    });
  }

  public_functions = { "info": getInfo };

  return public_functions;
};