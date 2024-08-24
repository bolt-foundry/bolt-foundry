'use strict';

var ReactRelayContext = require('./../ReactRelayContext');
var invariant = require('invariant');
var _require = require('react'),
  useContext = _require.useContext;
function useRelayEnvironment() {
  var context = useContext(ReactRelayContext);
  !(context != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useRelayEnvironment: Expected to have found a Relay environment provided by ' + 'a `RelayEnvironmentProvider` component. ' + 'This usually means that useRelayEnvironment was used in a ' + 'component that is not a descendant of a `RelayEnvironmentProvider`. ' + 'Please make sure a `RelayEnvironmentProvider` has been rendered somewhere ' + 'as a parent or ancestor of your component.') : invariant(false) : void 0;
  return context.environment;
}
module.exports = useRelayEnvironment;