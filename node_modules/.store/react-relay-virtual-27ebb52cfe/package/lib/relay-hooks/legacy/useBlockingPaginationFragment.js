'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _excluded = ["disableStoreUpdates", "enableStoreUpdates"];
var useLoadMoreFunction = require('../useLoadMoreFunction');
var useStaticFragmentNodeWarning = require('../useStaticFragmentNodeWarning');
var useRefetchableFragmentNode = require('./useRefetchableFragmentNode');
var invariant = require('invariant');
var _require = require('react'),
  useCallback = _require.useCallback,
  useEffect = _require.useEffect,
  useRef = _require.useRef,
  useState = _require.useState;
var _require2 = require('relay-runtime'),
  getFragment = _require2.getFragment,
  getFragmentIdentifier = _require2.getFragmentIdentifier,
  getPaginationMetadata = _require2.getPaginationMetadata;
function useBlockingPaginationFragment(fragmentInput, parentFragmentRef) {
  var componentDisplayName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'useBlockingPaginationFragment()';
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, "first argument of ".concat(componentDisplayName));
  var _getPaginationMetadat = getPaginationMetadata(fragmentNode, componentDisplayName),
    connectionPathInFragmentData = _getPaginationMetadat.connectionPathInFragmentData,
    paginationRequest = _getPaginationMetadat.paginationRequest,
    paginationMetadata = _getPaginationMetadat.paginationMetadata,
    stream = _getPaginationMetadat.stream;
  !(stream === false) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: @stream_connection is not compatible with `useBlockingPaginationFragment`. ' + 'Use `useStreamingPaginationFragment` instead.') : invariant(false) : void 0;
  var _useRefetchableFragme = useRefetchableFragmentNode(fragmentNode, parentFragmentRef, componentDisplayName),
    fragmentData = _useRefetchableFragme.fragmentData,
    fragmentRef = _useRefetchableFragme.fragmentRef,
    refetch = _useRefetchableFragme.refetch,
    disableStoreUpdates = _useRefetchableFragme.disableStoreUpdates,
    enableStoreUpdates = _useRefetchableFragme.enableStoreUpdates;
  var fragmentIdentifier = getFragmentIdentifier(fragmentNode, fragmentRef);
  var _useLoadMore = useLoadMore({
      componentDisplayName: componentDisplayName,
      connectionPathInFragmentData: connectionPathInFragmentData,
      direction: 'backward',
      disableStoreUpdates: disableStoreUpdates,
      enableStoreUpdates: enableStoreUpdates,
      fragmentData: fragmentData,
      fragmentIdentifier: fragmentIdentifier,
      fragmentNode: fragmentNode,
      fragmentRef: fragmentRef,
      paginationMetadata: paginationMetadata,
      paginationRequest: paginationRequest
    }),
    loadPrevious = _useLoadMore[0],
    hasPrevious = _useLoadMore[1],
    disposeFetchPrevious = _useLoadMore[2];
  var _useLoadMore2 = useLoadMore({
      componentDisplayName: componentDisplayName,
      connectionPathInFragmentData: connectionPathInFragmentData,
      direction: 'forward',
      disableStoreUpdates: disableStoreUpdates,
      enableStoreUpdates: enableStoreUpdates,
      fragmentData: fragmentData,
      fragmentIdentifier: fragmentIdentifier,
      fragmentNode: fragmentNode,
      fragmentRef: fragmentRef,
      paginationMetadata: paginationMetadata,
      paginationRequest: paginationRequest
    }),
    loadNext = _useLoadMore2[0],
    hasNext = _useLoadMore2[1],
    disposeFetchNext = _useLoadMore2[2];
  var refetchPagination = useCallback(function (variables, options) {
    disposeFetchNext();
    disposeFetchPrevious();
    return refetch(variables, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, options), {}, {
      __environment: undefined
    }));
  }, [disposeFetchNext, disposeFetchPrevious, refetch]);
  return {
    data: fragmentData,
    loadNext: loadNext,
    loadPrevious: loadPrevious,
    hasNext: hasNext,
    hasPrevious: hasPrevious,
    refetch: refetchPagination
  };
}
function useLoadMore(args) {
  var disableStoreUpdates = args.disableStoreUpdates,
    enableStoreUpdates = args.enableStoreUpdates,
    loadMoreArgs = (0, _objectWithoutPropertiesLoose2["default"])(args, _excluded);
  var _useState = useState(null),
    requestPromise = _useState[0],
    setRequestPromise = _useState[1];
  var requestPromiseRef = useRef(null);
  var promiseResolveRef = useRef(null);
  var promiseResolve = function promiseResolve() {
    if (promiseResolveRef.current != null) {
      promiseResolveRef.current();
      promiseResolveRef.current = null;
    }
  };
  var handleReset = function handleReset() {
    promiseResolve();
  };
  var observer = {
    complete: promiseResolve,
    start: function start() {
      disableStoreUpdates();
      var promise = new Promise(function (resolve) {
        promiseResolveRef.current = function () {
          requestPromiseRef.current = null;
          resolve();
        };
      });
      requestPromiseRef.current = promise;
      setRequestPromise(promise);
    },
    next: promiseResolve,
    error: promiseResolve
  };
  var _useLoadMoreFunction = useLoadMoreFunction((0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, loadMoreArgs), {}, {
      observer: observer,
      onReset: handleReset
    })),
    loadMore = _useLoadMoreFunction[0],
    hasMore = _useLoadMoreFunction[1],
    disposeFetch = _useLoadMoreFunction[2];
  if (requestPromise != null && requestPromise === requestPromiseRef.current) {
    throw requestPromise;
  }
  useEffect(function () {
    if (requestPromise !== requestPromiseRef.current) {
      enableStoreUpdates();
    }
  }, [requestPromise]);
  return [loadMore, hasMore, disposeFetch];
}
module.exports = useBlockingPaginationFragment;