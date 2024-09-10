'use strict';

var RelayEnvironmentProvider = require('../relay-hooks/RelayEnvironmentProvider');
var useRelayActorEnvironment = require('./useRelayActorEnvironment');
var React = require('react');
function ActorChange(props) {
  var actorEnvironment = useRelayActorEnvironment(props.actorChangePoint.__viewer);
  var getEnvironmentForActor = React.useCallback(function (actorIdentifier) {
    return actorEnvironment.multiActorEnvironment.forActor(actorIdentifier);
  }, [actorEnvironment]);
  return /*#__PURE__*/React.createElement(RelayEnvironmentProvider, {
    environment: actorEnvironment,
    getEnvironmentForActor: getEnvironmentForActor
  }, props.children(props.actorChangePoint.__fragmentRef, props.actorChangePoint.__viewer));
}
module.exports = ActorChange;