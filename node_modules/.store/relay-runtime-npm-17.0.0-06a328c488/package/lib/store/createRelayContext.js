'use strict';

var invariant = require('invariant');
var relayContext;
var firstReact;
function createRelayContext(react) {
  if (!relayContext) {
    relayContext = react.createContext(null);
    if (process.env.NODE_ENV !== "production") {
      relayContext.displayName = 'RelayContext';
    }
    firstReact = react;
  }
  !(react === firstReact) ? process.env.NODE_ENV !== "production" ? invariant(false, '[createRelayContext]: You are passing a different instance of React', react.version) : invariant(false) : void 0;
  return relayContext;
}
module.exports = createRelayContext;