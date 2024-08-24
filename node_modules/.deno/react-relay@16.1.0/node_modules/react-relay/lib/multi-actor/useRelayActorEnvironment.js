'use strict';

var ReactRelayContext = require('./../ReactRelayContext');
var invariant = require('invariant');
var _require = require('react'),
  useContext = _require.useContext;
function useRelayActorEnvironment(actorIdentifier) {
  var context = useContext(ReactRelayContext);
  !(context != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useRelayActorEnvironment: Expected to have found a Relay environment provided by ' + 'a `RelayEnvironmentProvider` component. ' + 'This usually means that useRelayActorEnvironment was used in a ' + 'component that is not a descendant of a `RelayEnvironmentProvider`. ' + 'Please make sure a `RelayEnvironmentProvider` has been rendered somewhere ' + 'as a parent or ancestor of your component.') : invariant(false) : void 0;
  var getEnvironmentForActor = context.getEnvironmentForActor;
  !(getEnvironmentForActor != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'useRelayActorEnvironment: Expected to have a function `getEnvironmentForActor`.' + 'This usually means that `RelayEnvironmentProvider`. was not properly set up for use in the ' + 'multi actor application. Please make sure the provider has defined a `getEnvironmentForActor`.') : invariant(false) : void 0;
  return getEnvironmentForActor(actorIdentifier);
}
module.exports = useRelayActorEnvironment;