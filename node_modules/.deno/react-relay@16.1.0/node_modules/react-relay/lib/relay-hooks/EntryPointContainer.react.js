'use strict';

var ProfilerContext = require('./ProfilerContext');
var useRelayEnvironment = require('./useRelayEnvironment');
var React = require('react');
var _require = require('react'),
  useContext = _require.useContext,
  useEffect = _require.useEffect;
var warning = require("fbjs/lib/warning");
function EntryPointContainer(_ref) {
  var entryPointReference = _ref.entryPointReference,
    props = _ref.props;
  process.env.NODE_ENV !== "production" ? warning(entryPointReference.isDisposed === false, '<EntryPointContainer>: Expected entryPointReference to not be disposed ' + 'yet. This is because disposing the entrypoint marks it for future garbage ' + 'collection, and as such may no longer be present in the Relay store. ' + 'In the future, this will become a hard error.') : void 0;
  var getComponent = entryPointReference.getComponent,
    queries = entryPointReference.queries,
    entryPoints = entryPointReference.entryPoints,
    extraProps = entryPointReference.extraProps,
    rootModuleID = entryPointReference.rootModuleID;
  var Component = getComponent();
  var profilerContext = useContext(ProfilerContext);
  var environment = useRelayEnvironment();
  useEffect(function () {
    environment.__log({
      name: 'entrypoint.root.consume',
      profilerContext: profilerContext,
      rootModuleID: rootModuleID
    });
  }, [environment, profilerContext, rootModuleID]);
  return /*#__PURE__*/React.createElement(Component, {
    entryPoints: entryPoints,
    extraProps: extraProps,
    props: props,
    queries: queries
  });
}
module.exports = EntryPointContainer;