'use strict';

var _require = require('./loadQuery'),
  useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;
var useLazyLoadQueryNode = require('./useLazyLoadQueryNode');
var useMemoOperationDescriptor = require('./useMemoOperationDescriptor');
var useRelayEnvironment = require('./useRelayEnvironment');
var _require2 = require('relay-runtime'),
  fetchQuery = _require2.__internal.fetchQuery;
function useLazyLoadQuery(gqlQuery, variables, options) {
  useTrackLoadQueryInRender();
  var environment = useRelayEnvironment();
  var query = useMemoOperationDescriptor(gqlQuery, variables, options && options.networkCacheConfig ? options.networkCacheConfig : {
    force: true
  });
  var data = useLazyLoadQueryNode({
    componentDisplayName: 'useLazyLoadQuery()',
    fetchKey: options === null || options === void 0 ? void 0 : options.fetchKey,
    fetchObservable: fetchQuery(environment, query),
    fetchPolicy: options === null || options === void 0 ? void 0 : options.fetchPolicy,
    query: query,
    renderPolicy: options === null || options === void 0 ? void 0 : options.UNSTABLE_renderPolicy
  });
  return data;
}
module.exports = useLazyLoadQuery;