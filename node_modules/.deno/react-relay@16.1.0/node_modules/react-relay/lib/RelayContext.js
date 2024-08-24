'use strict';

var isRelayEnvironment = require('./isRelayEnvironment');
var invariant = require('invariant');
function assertRelayContext(relay) {
  !isRelayContext(relay) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayContext: Expected `context.relay` to be an object conforming to ' + 'the `RelayContext` interface, got `%s`.', relay) : invariant(false) : void 0;
  return relay;
}
function isRelayContext(context) {
  return typeof context === 'object' && context !== null && !Array.isArray(context) && isRelayEnvironment(context.environment);
}
module.exports = {
  assertRelayContext: assertRelayContext,
  isRelayContext: isRelayContext
};