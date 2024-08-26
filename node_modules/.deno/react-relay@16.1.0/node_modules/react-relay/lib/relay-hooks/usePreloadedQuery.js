'use strict';

var _require = require('./loadQuery'),
  useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;
var useLazyLoadQueryNode = require('./useLazyLoadQueryNode');
var useMemoOperationDescriptor = require('./useMemoOperationDescriptor');
var useRelayEnvironment = require('./useRelayEnvironment');
var invariant = require('invariant');
var _require2 = require('react'),
  useDebugValue = _require2.useDebugValue;
var _require3 = require('relay-runtime'),
  _require3$__internal = _require3.__internal,
  fetchQueryDeduped = _require3$__internal.fetchQueryDeduped,
  fetchQuery = _require3$__internal.fetchQuery;
var warning = require("fbjs/lib/warning");
function usePreloadedQuery(gqlQuery, preloadedQuery, options) {
  useTrackLoadQueryInRender();
  var environment = useRelayEnvironment();
  var fetchKey = preloadedQuery.fetchKey,
    fetchPolicy = preloadedQuery.fetchPolicy,
    source = preloadedQuery.source,
    variables = preloadedQuery.variables,
    networkCacheConfig = preloadedQuery.networkCacheConfig;
  var operation = useMemoOperationDescriptor(gqlQuery, variables, networkCacheConfig);
  var useLazyLoadQueryNodeParams;
  if (preloadedQuery.kind === 'PreloadedQuery_DEPRECATED') {
    !(operation.request.node.params.name === preloadedQuery.name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'usePreloadedQuery(): Expected data to be prefetched for query `%s`, ' + 'got prefetch results for query `%s`.', operation.request.node.params.name, preloadedQuery.name) : invariant(false) : void 0;
    useLazyLoadQueryNodeParams = {
      componentDisplayName: 'usePreloadedQuery()',
      fetchKey: fetchKey,
      fetchObservable: fetchQueryDeduped(environment, operation.request.identifier, function () {
        if (environment === preloadedQuery.environment && source != null) {
          return environment.executeWithSource({
            operation: operation,
            source: source
          });
        } else {
          return environment.execute({
            operation: operation
          });
        }
      }),
      fetchPolicy: fetchPolicy,
      query: operation,
      renderPolicy: options === null || options === void 0 ? void 0 : options.UNSTABLE_renderPolicy
    };
  } else {
    process.env.NODE_ENV !== "production" ? warning(preloadedQuery.isDisposed === false, 'usePreloadedQuery(): Expected preloadedQuery to not be disposed yet. ' + 'This is because disposing the query marks it for future garbage ' + 'collection, and as such query results may no longer be present in the Relay ' + 'store. In the future, this will become a hard error.') : void 0;
    var fallbackFetchObservable = fetchQuery(environment, operation);
    var fetchObservable;
    if (source != null && environment === preloadedQuery.environment) {
      fetchObservable = source.ifEmpty(fallbackFetchObservable);
    } else if (environment !== preloadedQuery.environment) {
      process.env.NODE_ENV !== "production" ? warning(false, 'usePreloadedQuery(): usePreloadedQuery was passed a preloaded query ' + 'that was created with a different environment than the one that is currently ' + 'in context. In the future, this will become a hard error.') : void 0;
      fetchObservable = fallbackFetchObservable;
    } else {
      fetchObservable = fallbackFetchObservable;
    }
    useLazyLoadQueryNodeParams = {
      componentDisplayName: 'usePreloadedQuery()',
      fetchObservable: fetchObservable,
      fetchKey: fetchKey,
      fetchPolicy: fetchPolicy,
      query: operation,
      renderPolicy: options === null || options === void 0 ? void 0 : options.UNSTABLE_renderPolicy
    };
  }
  var data = useLazyLoadQueryNode(useLazyLoadQueryNodeParams);
  if (process.env.NODE_ENV !== "production") {
    useDebugValue({
      query: preloadedQuery.name,
      variables: preloadedQuery.variables,
      data: data,
      fetchKey: fetchKey,
      fetchPolicy: fetchPolicy,
      renderPolicy: options === null || options === void 0 ? void 0 : options.UNSTABLE_renderPolicy
    });
  }
  return data;
}
module.exports = usePreloadedQuery;