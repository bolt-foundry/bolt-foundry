'use strict';

var ProfilerContext = require('./ProfilerContext');
var _require = require('./QueryResource'),
  getQueryCacheIdentifier = _require.getQueryCacheIdentifier,
  getQueryResourceForEnvironment = _require.getQueryResourceForEnvironment;
var useFetchTrackingRef = require('./useFetchTrackingRef');
var useFragmentInternal = require('./useFragmentInternal');
var useRelayEnvironment = require('./useRelayEnvironment');
var React = require('react');
var useContext = React.useContext,
  useEffect = React.useEffect,
  useState = React.useState,
  useRef = React.useRef;
function useLazyLoadQueryNode(_ref) {
  var query = _ref.query,
    componentDisplayName = _ref.componentDisplayName,
    fetchObservable = _ref.fetchObservable,
    fetchPolicy = _ref.fetchPolicy,
    fetchKey = _ref.fetchKey,
    renderPolicy = _ref.renderPolicy;
  var environment = useRelayEnvironment();
  var profilerContext = useContext(ProfilerContext);
  var QueryResource = getQueryResourceForEnvironment(environment);
  var _useState = useState(0),
    forceUpdateKey = _useState[0],
    forceUpdate = _useState[1];
  var _useFetchTrackingRef = useFetchTrackingRef(),
    startFetch = _useFetchTrackingRef.startFetch,
    completeFetch = _useFetchTrackingRef.completeFetch;
  var cacheBreaker = "".concat(forceUpdateKey, "-").concat(fetchKey !== null && fetchKey !== void 0 ? fetchKey : '');
  var cacheIdentifier = getQueryCacheIdentifier(environment, query, fetchPolicy, renderPolicy, cacheBreaker);
  var preparedQueryResult = profilerContext.wrapPrepareQueryResource(function () {
    return QueryResource.prepareWithIdentifier(cacheIdentifier, query, fetchObservable, fetchPolicy, renderPolicy, {
      start: startFetch,
      complete: completeFetch,
      error: completeFetch
    }, profilerContext);
  });
  var maybeHiddenOrFastRefresh = useRef(false);
  useEffect(function () {
    return function () {
      maybeHiddenOrFastRefresh.current = true;
    };
  }, []);
  useEffect(function () {
    if (maybeHiddenOrFastRefresh.current === true) {
      maybeHiddenOrFastRefresh.current = false;
      forceUpdate(function (n) {
        return n + 1;
      });
      return;
    }
    var disposable = QueryResource.retain(preparedQueryResult, profilerContext);
    return function () {
      disposable.dispose();
    };
  }, [environment, cacheIdentifier]);
  useEffect(function () {
    QueryResource.releaseTemporaryRetain(preparedQueryResult);
  });
  var fragmentNode = preparedQueryResult.fragmentNode,
    fragmentRef = preparedQueryResult.fragmentRef;
  var data = useFragmentInternal(fragmentNode, fragmentRef, componentDisplayName);
  return data;
}
module.exports = useLazyLoadQueryNode;