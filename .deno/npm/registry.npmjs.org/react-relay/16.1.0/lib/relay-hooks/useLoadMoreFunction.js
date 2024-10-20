'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var useFetchTrackingRef = require('./useFetchTrackingRef');
var useIsMountedRef = require('./useIsMountedRef');
var useIsOperationNodeActive = require('./useIsOperationNodeActive');
var useRelayEnvironment = require('./useRelayEnvironment');
var invariant = require('invariant');
var _require = require('react'),
  useCallback = _require.useCallback,
  useEffect = _require.useEffect,
  useState = _require.useState;
var _require2 = require('relay-runtime'),
  fetchQuery = _require2.__internal.fetchQuery,
  ConnectionInterface = _require2.ConnectionInterface,
  createOperationDescriptor = _require2.createOperationDescriptor,
  getPaginationVariables = _require2.getPaginationVariables,
  getRefetchMetadata = _require2.getRefetchMetadata,
  getSelector = _require2.getSelector,
  getValueAtPath = _require2.getValueAtPath;
var warning = require("fbjs/lib/warning");
function useLoadMoreFunction(args) {
  var direction = args.direction,
    fragmentNode = args.fragmentNode,
    fragmentRef = args.fragmentRef,
    fragmentIdentifier = args.fragmentIdentifier,
    fragmentData = args.fragmentData,
    connectionPathInFragmentData = args.connectionPathInFragmentData,
    paginationRequest = args.paginationRequest,
    paginationMetadata = args.paginationMetadata,
    componentDisplayName = args.componentDisplayName,
    observer = args.observer,
    onReset = args.onReset;
  var environment = useRelayEnvironment();
  var _useFetchTrackingRef = useFetchTrackingRef(),
    isFetchingRef = _useFetchTrackingRef.isFetchingRef,
    startFetch = _useFetchTrackingRef.startFetch,
    disposeFetch = _useFetchTrackingRef.disposeFetch,
    completeFetch = _useFetchTrackingRef.completeFetch;
  var _getRefetchMetadata = getRefetchMetadata(fragmentNode, componentDisplayName),
    identifierInfo = _getRefetchMetadata.identifierInfo;
  var identifierValue = (identifierInfo === null || identifierInfo === void 0 ? void 0 : identifierInfo.identifierField) != null && fragmentData != null && typeof fragmentData === 'object' ? fragmentData[identifierInfo.identifierField] : null;
  var isMountedRef = useIsMountedRef();
  var _useState = useState(environment),
    mirroredEnvironment = _useState[0],
    setMirroredEnvironment = _useState[1];
  var _useState2 = useState(fragmentIdentifier),
    mirroredFragmentIdentifier = _useState2[0],
    setMirroredFragmentIdentifier = _useState2[1];
  var isParentQueryActive = useIsOperationNodeActive(fragmentNode, fragmentRef);
  var shouldReset = environment !== mirroredEnvironment || fragmentIdentifier !== mirroredFragmentIdentifier;
  if (shouldReset) {
    disposeFetch();
    onReset();
    setMirroredEnvironment(environment);
    setMirroredFragmentIdentifier(fragmentIdentifier);
  }
  var _getConnectionState = getConnectionState(direction, fragmentNode, fragmentData, connectionPathInFragmentData),
    cursor = _getConnectionState.cursor,
    hasMore = _getConnectionState.hasMore;
  useEffect(function () {
    return function () {
      disposeFetch();
    };
  }, [disposeFetch]);
  var loadMore = useCallback(function (count, options) {
    var onComplete = options === null || options === void 0 ? void 0 : options.onComplete;
    if (isMountedRef.current !== true) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Unexpected fetch on unmounted component for fragment ' + '`%s` in `%s`. It looks like some instances of your component are ' + 'still trying to fetch data but they already unmounted. ' + 'Please make sure you clear all timers, intervals, ' + 'async calls, etc that may trigger a fetch.', fragmentNode.name, componentDisplayName) : void 0;
      return {
        dispose: function dispose() {}
      };
    }
    var fragmentSelector = getSelector(fragmentNode, fragmentRef);
    if (isFetchingRef.current === true || fragmentData == null || isParentQueryActive) {
      if (fragmentSelector == null) {
        process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Unexpected fetch while using a null fragment ref ' + 'for fragment `%s` in `%s`. When fetching more items, we expect ' + "initial fragment data to be non-null. Please make sure you're " + 'passing a valid fragment ref to `%s` before paginating.', fragmentNode.name, componentDisplayName, componentDisplayName) : void 0;
      }
      if (onComplete) {
        onComplete(null);
      }
      return {
        dispose: function dispose() {}
      };
    }
    !(fragmentSelector != null && fragmentSelector.kind !== 'PluralReaderSelector') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to be able to find a non-plural fragment owner for ' + "fragment `%s` when using `%s`. If you're seeing this, " + 'this is likely a bug in Relay.', fragmentNode.name, componentDisplayName) : invariant(false) : void 0;
    var parentVariables = fragmentSelector.owner.variables;
    var fragmentVariables = fragmentSelector.variables;
    var extraVariables = options === null || options === void 0 ? void 0 : options.UNSTABLE_extraVariables;
    var baseVariables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, parentVariables), fragmentVariables);
    var paginationVariables = getPaginationVariables(direction, count, cursor, baseVariables, (0, _objectSpread2["default"])({}, extraVariables), paginationMetadata);
    if (identifierInfo != null) {
      if (typeof identifierValue !== 'string') {
        process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Expected result to have a string  ' + '`%s` in order to refetch, got `%s`.', identifierInfo.identifierField, identifierValue) : void 0;
      }
      paginationVariables[identifierInfo.identifierQueryVariableName] = identifierValue;
    }
    var paginationQuery = createOperationDescriptor(paginationRequest, paginationVariables, {
      force: true
    });
    fetchQuery(environment, paginationQuery).subscribe((0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, observer), {}, {
      start: function start(subscription) {
        startFetch(subscription);
        observer.start && observer.start(subscription);
      },
      complete: function complete() {
        completeFetch();
        observer.complete && observer.complete();
        onComplete && onComplete(null);
      },
      error: function error(_error) {
        completeFetch();
        observer.error && observer.error(_error);
        onComplete && onComplete(_error);
      }
    }));
    return {
      dispose: disposeFetch
    };
  }, [environment, identifierValue, direction, cursor, startFetch, disposeFetch, completeFetch, isFetchingRef, isParentQueryActive, fragmentData, fragmentNode.name, fragmentRef, componentDisplayName]);
  return [loadMore, hasMore, disposeFetch];
}
function getConnectionState(direction, fragmentNode, fragmentData, connectionPathInFragmentData) {
  var _pageInfo$END_CURSOR, _pageInfo$START_CURSO;
  var _ConnectionInterface$ = ConnectionInterface.get(),
    EDGES = _ConnectionInterface$.EDGES,
    PAGE_INFO = _ConnectionInterface$.PAGE_INFO,
    HAS_NEXT_PAGE = _ConnectionInterface$.HAS_NEXT_PAGE,
    HAS_PREV_PAGE = _ConnectionInterface$.HAS_PREV_PAGE,
    END_CURSOR = _ConnectionInterface$.END_CURSOR,
    START_CURSOR = _ConnectionInterface$.START_CURSOR;
  var connection = getValueAtPath(fragmentData, connectionPathInFragmentData);
  if (connection == null) {
    return {
      cursor: null,
      hasMore: false
    };
  }
  !(typeof connection === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected connection in fragment `%s` to have been `null`, or ' + 'a plain object with %s and %s properties. Instead got `%s`.', fragmentNode.name, EDGES, PAGE_INFO, connection) : invariant(false) : void 0;
  var edges = connection[EDGES];
  var pageInfo = connection[PAGE_INFO];
  if (edges == null || pageInfo == null) {
    return {
      cursor: null,
      hasMore: false
    };
  }
  !Array.isArray(edges) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected connection in fragment `%s` to have a plural `%s` field. ' + 'Instead got `%s`.', fragmentNode.name, EDGES, edges) : invariant(false) : void 0;
  !(typeof pageInfo === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected connection in fragment `%s` to have a `%s` field. ' + 'Instead got `%s`.', fragmentNode.name, PAGE_INFO, pageInfo) : invariant(false) : void 0;
  var cursor = direction === 'forward' ? (_pageInfo$END_CURSOR = pageInfo[END_CURSOR]) !== null && _pageInfo$END_CURSOR !== void 0 ? _pageInfo$END_CURSOR : null : (_pageInfo$START_CURSO = pageInfo[START_CURSOR]) !== null && _pageInfo$START_CURSO !== void 0 ? _pageInfo$START_CURSO : null;
  !(cursor === null || typeof cursor === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected page info for connection in fragment `%s` to have a ' + 'valid `%s`. Instead got `%s`.', fragmentNode.name, START_CURSOR, cursor) : invariant(false) : void 0;
  var hasMore;
  if (direction === 'forward') {
    hasMore = cursor != null && pageInfo[HAS_NEXT_PAGE] === true;
  } else {
    hasMore = cursor != null && pageInfo[HAS_PREV_PAGE] === true;
  }
  return {
    cursor: cursor,
    hasMore: hasMore
  };
}
module.exports = useLoadMoreFunction;