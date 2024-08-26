'use strict';

var ReactRelayContext = require('./ReactRelayContext');
var React = require('react');
function ReactRelayFragmentMockRenderer(props) {
  return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
    value: {
      environment: props.environment
    }
  }, props.render());
}
module.exports = ReactRelayFragmentMockRenderer;