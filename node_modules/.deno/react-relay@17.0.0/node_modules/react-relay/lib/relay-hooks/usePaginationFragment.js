'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var useLoadMoreFunction = require('./useLoadMoreFunction');
var useRefetchableFragmentInternal = require('./useRefetchableFragmentInternal');
var useRelayEnvironment = require('./useRelayEnvironment');
var useStaticFragmentNodeWarning = require('./useStaticFragmentNodeWarning');
var _require = require('react'),
  useCallback = _require.useCallback,
  useDebugValue = _require.useDebugValue,
  useState = _require.useState;
var _require2 = require('relay-runtime'),
  getFragment = _require2.getFragment,
  getFragmentIdentifier = _require2.getFragmentIdentifier,
  getPaginationMetadata = _require2.getPaginationMetadata;
function usePaginationFragment(fragmentInput, parentFragmentRef) {
  var fragmentNode = getFragment(fragmentInput);
  useStaticFragmentNodeWarning(fragmentNode, 'first argument of usePaginationFragment()');
  var componentDisplayName = 'usePaginationFragment()';
  var _getPaginationMetadat = getPaginationMetadata(fragmentNode, componentDisplayName),
    connectionPathInFragmentData = _getPaginationMetadat.connectionPathInFragmentData,
    paginationRequest = _getPaginationMetadat.paginationRequest,
    paginationMetadata = _getPaginationMetadat.paginationMetadata;
  var _useRefetchableFragme = useRefetchableFragmentInternal(fragmentNode, parentFragmentRef, componentDisplayName),
    fragmentData = _useRefetchableFragme.fragmentData,
    fragmentRef = _useRefetchableFragme.fragmentRef,
    refetch = _useRefetchableFragme.refetch;
  var fragmentIdentifier = getFragmentIdentifier(fragmentNode, fragmentRef);
  var _useLoadMore = useLoadMore({
      componentDisplayName: componentDisplayName,
      connectionPathInFragmentData: connectionPathInFragmentData,
      direction: 'backward',
      fragmentData: fragmentData,
      fragmentIdentifier: fragmentIdentifier,
      fragmentNode: fragmentNode,
      fragmentRef: fragmentRef,
      paginationMetadata: paginationMetadata,
      paginationRequest: paginationRequest
    }),
    loadPrevious = _useLoadMore[0],
    hasPrevious = _useLoadMore[1],
    isLoadingPrevious = _useLoadMore[2],
    disposeFetchPrevious = _useLoadMore[3];
  var _useLoadMore2 = useLoadMore({
      componentDisplayName: componentDisplayName,
      connectionPathInFragmentData: connectionPathInFragmentData,
      direction: 'forward',
      fragmentData: fragmentData,
      fragmentIdentifier: fragmentIdentifier,
      fragmentNode: fragmentNode,
      fragmentRef: fragmentRef,
      paginationMetadata: paginationMetadata,
      paginationRequest: paginationRequest
    }),
    loadNext = _useLoadMore2[0],
    hasNext = _useLoadMore2[1],
    isLoadingNext = _useLoadMore2[2],
    disposeFetchNext = _useLoadMore2[3];
  var refetchPagination = useCallback(function (variables, options) {
    disposeFetchNext();
    disposeFetchPrevious();
    return refetch(variables, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, options), {}, {
      __environment: undefined
    }));
  }, [disposeFetchNext, disposeFetchPrevious, refetch]);
  if (process.env.NODE_ENV !== "production") {
    useDebugValue({
      fragment: fragmentNode.name,
      data: fragmentData,
      hasNext: hasNext,
      isLoadingNext: isLoadingNext,
      hasPrevious: hasPrevious,
      isLoadingPrevious: isLoadingPrevious
    });
  }
  return {
    data: fragmentData,
    loadNext: loadNext,
    loadPrevious: loadPrevious,
    hasNext: hasNext,
    hasPrevious: hasPrevious,
    isLoadingNext: isLoadingNext,
    isLoadingPrevious: isLoadingPrevious,
    refetch: refetchPagination
  };
}
function useLoadMore(args) {
  var environment = useRelayEnvironment();
  var _useState = useState(false),
    isLoadingMore = _useState[0],
    reallySetIsLoadingMore = _useState[1];
  var setIsLoadingMore = function setIsLoadingMore(value) {
    var _environment$getSched;
    var schedule = (_environment$getSched = environment.getScheduler()) === null || _environment$getSched === void 0 ? void 0 : _environment$getSched.schedule;
    if (schedule) {
      schedule(function () {
        reallySetIsLoadingMore(value);
      });
    } else {
      reallySetIsLoadingMore(value);
    }
  };
  var observer = {
    start: function start() {
      return setIsLoadingMore(true);
    },
    complete: function complete() {
      return setIsLoadingMore(false);
    },
    error: function error() {
      return setIsLoadingMore(false);
    }
  };
  var handleReset = function handleReset() {
    return setIsLoadingMore(false);
  };
  var _useLoadMoreFunction = useLoadMoreFunction((0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, args), {}, {
      observer: observer,
      onReset: handleReset
    })),
    loadMore = _useLoadMoreFunction[0],
    hasMore = _useLoadMoreFunction[1],
    disposeFetch = _useLoadMoreFunction[2];
  return [loadMore, hasMore, isLoadingMore, disposeFetch];
}
module.exports = usePaginationFragment;