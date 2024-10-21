'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var assertFragmentMap = require('./assertFragmentMap');
var _require = require('./ReactRelayContainerUtils'),
  getComponentName = _require.getComponentName,
  getContainerName = _require.getContainerName;
var ReactRelayContext = require('./ReactRelayContext');
var ReactRelayQueryRendererContext = require('./ReactRelayQueryRendererContext');
var invariant = require('invariant');
var React = require('react');
var _require2 = require('relay-runtime'),
  getFragment = _require2.getFragment;
var useContext = React.useContext;
function buildReactRelayContainer(ComponentClass, fragmentSpec, createContainerWithFragments) {
  var containerName = getContainerName(ComponentClass);
  assertFragmentMap(getComponentName(ComponentClass), fragmentSpec);
  var fragments = {};
  for (var key in fragmentSpec) {
    fragments[key] = getFragment(fragmentSpec[key]);
  }
  var Container = createContainerWithFragments(ComponentClass, fragments);
  Container.displayName = containerName;
  function ForwardRef(props, ref) {
    var _queryRendererContext;
    var context = useContext(ReactRelayContext);
    !(context != null) ? process.env.NODE_ENV !== "production" ? invariant(false, '`%s` tried to render a context that was not valid this means that ' + '`%s` was rendered outside of a query renderer.', containerName, containerName) : invariant(false) : void 0;
    var queryRendererContext = useContext(ReactRelayQueryRendererContext);
    return /*#__PURE__*/React.createElement(Container, (0, _extends2["default"])({}, props, {
      __relayContext: context,
      __rootIsQueryRenderer: (_queryRendererContext = queryRendererContext === null || queryRendererContext === void 0 ? void 0 : queryRendererContext.rootIsQueryRenderer) !== null && _queryRendererContext !== void 0 ? _queryRendererContext : false,
      componentRef: props.componentRef || ref
    }));
  }
  ForwardRef.displayName = containerName;
  var ForwardContainer = React.forwardRef(ForwardRef);
  if (process.env.NODE_ENV !== "production") {
    ForwardContainer.__ComponentClass = ComponentClass;
    ForwardContainer.displayName = containerName;
  }
  return ForwardContainer;
}
module.exports = buildReactRelayContainer;