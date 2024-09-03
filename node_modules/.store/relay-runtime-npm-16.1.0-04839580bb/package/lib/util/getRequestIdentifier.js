'use strict';

var stableCopy = require('./stableCopy');
var invariant = require('invariant');
function getRequestIdentifier(parameters, variables) {
  var requestID = parameters.cacheID != null ? parameters.cacheID : parameters.id;
  !(requestID != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'getRequestIdentifier: Expected request `%s` to have either a ' + 'valid `id` or `cacheID` property', parameters.name) : invariant(false) : void 0;
  return requestID + JSON.stringify(stableCopy(variables));
}
module.exports = getRequestIdentifier;