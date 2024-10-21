'use strict';

var preloadQuery_DEPRECATED = require('./preloadQuery_DEPRECATED');
var ProfilerContext = require('./ProfilerContext');
var useRelayEnvironment = require('./useRelayEnvironment');
var React = require('react');
var _require = require('react'),
  useContext = _require.useContext,
  useEffect = _require.useEffect,
  useMemo = _require.useMemo;
var _require2 = require('relay-runtime'),
  stableCopy = _require2.stableCopy;
function stableStringify(value) {
  var _JSON$stringify;
  return (_JSON$stringify = JSON.stringify(stableCopy(value))) !== null && _JSON$stringify !== void 0 ? _JSON$stringify : 'null';
}
function prepareEntryPoint(environmentProvider, entryPoint, entryPointParams) {
  var loadingPromise = null;
  if (entryPoint.root.getModuleIfRequired() == null) {
    loadingPromise = entryPoint.root.load();
  }
  var preloadProps = entryPoint.getPreloadProps(entryPointParams);
  var queries = preloadProps.queries,
    entryPoints = preloadProps.entryPoints,
    extraProps = preloadProps.extraProps;
  var preloadedQueries = {};
  var preloadedEntryPoints = {};
  if (queries != null) {
    var queriesPropNames = Object.keys(queries);
    queriesPropNames.forEach(function (queryPropName) {
      var _queries$queryPropNam = queries[queryPropName],
        environmentProviderOptions = _queries$queryPropNam.environmentProviderOptions,
        options = _queries$queryPropNam.options,
        parameters = _queries$queryPropNam.parameters,
        variables = _queries$queryPropNam.variables;
      var environment = environmentProvider.getEnvironment(environmentProviderOptions);
      preloadedQueries[queryPropName] = preloadQuery_DEPRECATED(environment, parameters, variables, options, environmentProviderOptions);
    });
  }
  if (entryPoints != null) {
    var entryPointPropNames = Object.keys(entryPoints);
    entryPointPropNames.forEach(function (entryPointPropName) {
      var entryPointDescription = entryPoints[entryPointPropName];
      if (entryPointDescription == null) {
        return;
      }
      var nestedEntryPoint = entryPointDescription.entryPoint,
        nestedParams = entryPointDescription.entryPointParams;
      preloadedEntryPoints[entryPointPropName] = prepareEntryPoint(environmentProvider, nestedEntryPoint, nestedParams);
    });
  }
  return {
    entryPoints: preloadedEntryPoints,
    extraProps: extraProps !== null && extraProps !== void 0 ? extraProps : null,
    getComponent: function getComponent() {
      var component = entryPoint.root.getModuleIfRequired();
      if (component == null) {
        var _loadingPromise;
        loadingPromise = (_loadingPromise = loadingPromise) !== null && _loadingPromise !== void 0 ? _loadingPromise : entryPoint.root.load();
        throw loadingPromise;
      }
      return component;
    },
    queries: preloadedQueries,
    rootModuleID: entryPoint.root.getModuleId()
  };
}
function LazyLoadEntryPointContainer_DEPRECATED(_ref) {
  var entryPoint = _ref.entryPoint,
    entryPointParams = _ref.entryPointParams,
    props = _ref.props,
    environmentProvider = _ref.environmentProvider;
  var environment = useRelayEnvironment();
  var getPreloadProps = entryPoint.getPreloadProps;
  var entryPointParamsHash = stableStringify(entryPointParams);
  var _useMemo = useMemo(function () {
      return prepareEntryPoint(environmentProvider !== null && environmentProvider !== void 0 ? environmentProvider : {
        getEnvironment: function getEnvironment() {
          return environment;
        }
      }, entryPoint, entryPointParams);
    }, [environment, environmentProvider, getPreloadProps, entryPointParamsHash]),
    getComponent = _useMemo.getComponent,
    queries = _useMemo.queries,
    entryPoints = _useMemo.entryPoints,
    extraProps = _useMemo.extraProps,
    rootModuleID = _useMemo.rootModuleID;
  var Component = useMemo(function () {
    return getComponent();
  }, [getComponent]);
  var profilerContext = useContext(ProfilerContext);
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
module.exports = LazyLoadEntryPointContainer_DEPRECATED;