'use strict';

var _require = require('./loadQuery'),
  loadQuery = _require.loadQuery;
function loadEntryPoint(environmentProvider, entryPoint, entryPointParams) {
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
      preloadedQueries[queryPropName] = loadQuery(environment, parameters, variables, {
        fetchPolicy: options === null || options === void 0 ? void 0 : options.fetchPolicy,
        networkCacheConfig: options === null || options === void 0 ? void 0 : options.networkCacheConfig,
        __nameForWarning: 'loadEntryPoint'
      }, environmentProviderOptions);
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
      preloadedEntryPoints[entryPointPropName] = loadEntryPoint(environmentProvider, nestedEntryPoint, nestedParams);
    });
  }
  var isDisposed = false;
  return {
    dispose: function dispose() {
      if (isDisposed) {
        return;
      }
      if (preloadedQueries != null) {
        Object.values(preloadedQueries).forEach(function (_ref) {
          var innerDispose = _ref.dispose;
          innerDispose();
        });
      }
      if (preloadedEntryPoints != null) {
        Object.values(preloadedEntryPoints).forEach(function (_ref2) {
          var innerDispose = _ref2.dispose;
          innerDispose();
        });
      }
      isDisposed = true;
    },
    entryPoints: preloadedEntryPoints,
    extraProps: extraProps !== null && extraProps !== void 0 ? extraProps : null,
    getComponent: function getComponent() {
      var componentModule = entryPoint.root.getModuleIfRequired();
      if (componentModule == null) {
        var _loadingPromise;
        loadingPromise = (_loadingPromise = loadingPromise) !== null && _loadingPromise !== void 0 ? _loadingPromise : entryPoint.root.load();
        throw loadingPromise;
      }
      var component = componentModule["default"] != null ? componentModule["default"] : componentModule;
      return component;
    },
    get isDisposed() {
      return isDisposed;
    },
    queries: preloadedQueries,
    rootModuleID: entryPoint.root.getModuleId()
  };
}
module.exports = loadEntryPoint;