'use strict';

var ReactRelayContext = require('./../ReactRelayContext');
var React = require('react');
var useMemo = React.useMemo;
function RelayEnvironmentProvider(props) {
  var children = props.children,
    environment = props.environment,
    getEnvironmentForActor = props.getEnvironmentForActor;
  var context = useMemo(function () {
    return {
      environment: environment,
      getEnvironmentForActor: getEnvironmentForActor
    };
  }, [environment, getEnvironmentForActor]);
  return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
    value: context
  }, children);
}
module.exports = RelayEnvironmentProvider;