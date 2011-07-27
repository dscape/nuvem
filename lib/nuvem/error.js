/*
 * Nuvem Errors
 * 
 * Extension on Error to support more complex logic.
 * 
 * @param {apiCode} The Internal namespaced api code
 * @param {message} The message that will be put in the error
 *
 * @return An error augmented with HTTP and API status codes
 */
function genericError (error, nuvemCode, type) {
  if(typeof error === 'string') {
    error = new Error(error); }
  error.nuvem_code  = nuvemCode;
  error.type      = type;
  return error;
}

exports.socketError = 
  function (error, nuvemCode) { return genericError(error,nuvemCode,"socket"); }; 
exports.jsonError = 
  function (error, nuvemCode) { return genericError(error,nuvemCode,"json"); }; 
exports.paramsError = 
  function (error, nuvemCode) { return genericError(error,nuvemCode,"params"); };