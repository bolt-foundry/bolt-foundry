'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _require = require('./loadQuery'),
  loadQuery = _require.loadQuery,
  useTrackLoadQueryInRender = _require.useTrackLoadQueryInRender;
var useIsMountedRef = require('./useIsMountedRef');
var useRelayEnvironment = require('./useRelayEnvironment');
var _require2 = require('react'),
  useCallback = _require2.useCallback,
  useEffect = _require2.useEffect,
  useRef = _require2.useRef,
  useState = _require2.useState;
var _require3 = require('relay-runtime'),
  getRequest = _require3.getRequest;
var initialNullQueryReferenceState = {
  kind: 'NullQueryReference'
};
function requestIsLiveQuery(preloadableRequest) {
  if (preloadableRequest.kind === 'PreloadableConcreteRequest') {
    return preloadableRequest.params.metadata.live !== undefined;
  }
  var request = getRequest(preloadableRequest);
  return request.params.metadata.live !== undefined;
}
function useQueryLoader(preloadableRequest, initialQueryReference) {
  var initialQueryReferenceInternal = initialQueryReference !== null && initialQueryReference !== void 0 ? initialQueryReference : initialNullQueryReferenceState;
  var environment = useRelayEnvironment();
  useTrackLoadQueryInRender();
  var isMountedRef = useIsMountedRef();
  var undisposedQueryReferencesRef = useRef(new Set([initialQueryReferenceInternal]));
  var _useState = useState(function () {
      return initialQueryReferenceInternal;
    }),
    queryReference = _useState[0],
    setQueryReference = _useState[1];
  var _useState2 = useState(function () {
      return initialQueryReferenceInternal;
    }),
    previousInitialQueryReference = _useState2[0],
    setPreviousInitialQueryReference = _useState2[1];
  if (initialQueryReferenceInternal !== previousInitialQueryReference) {
    undisposedQueryReferencesRef.current.add(initialQueryReferenceInternal);
    setPreviousInitialQueryReference(initialQueryReferenceInternal);
    setQueryReference(initialQueryReferenceInternal);
  }
  var disposeQuery = useCallback(function () {
    if (isMountedRef.current) {
      undisposedQueryReferencesRef.current.add(initialNullQueryReferenceState);
      setQueryReference(initialNullQueryReferenceState);
    }
  }, [isMountedRef]);
  var queryLoaderCallback = useCallback(function (variables, options) {
    var mergedOptions = options != null && options.hasOwnProperty('__environment') ? {
      fetchPolicy: options.fetchPolicy,
      networkCacheConfig: options.networkCacheConfig,
      __nameForWarning: options.__nameForWarning
    } : options;
    if (isMountedRef.current) {
      var _options$__environmen;
      var updatedQueryReference = loadQuery((_options$__environmen = options === null || options === void 0 ? void 0 : options.__environment) !== null && _options$__environmen !== void 0 ? _options$__environmen : environment, preloadableRequest, variables, mergedOptions);
      undisposedQueryReferencesRef.current.add(updatedQueryReference);
      setQueryReference(updatedQueryReference);
    }
  }, [environment, preloadableRequest, setQueryReference, isMountedRef]);
  var maybeHiddenOrFastRefresh = useRef(false);
  useEffect(function () {
    return function () {
      maybeHiddenOrFastRefresh.current = true;
    };
  }, []);
  useEffect(function () {
    if (maybeHiddenOrFastRefresh.current === true) {
      maybeHiddenOrFastRefresh.current = false;
      if (queryReference.kind !== 'NullQueryReference') {
        queryLoaderCallback(queryReference.variables, {
          fetchPolicy: queryReference.fetchPolicy,
          networkCacheConfig: queryReference.networkCacheConfig
        });
      }
      return;
    }
    var undisposedQueryReferences = undisposedQueryReferencesRef.current;
    if (isMountedRef.current) {
      var _iterator = (0, _createForOfIteratorHelper2["default"])(undisposedQueryReferences),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var undisposedQueryReference = _step.value;
          if (undisposedQueryReference === queryReference) {
            break;
          }
          undisposedQueryReferences["delete"](undisposedQueryReference);
          if (undisposedQueryReference.kind !== 'NullQueryReference') {
            if (requestIsLiveQuery(preloadableRequest)) {
              undisposedQueryReference.dispose && undisposedQueryReference.dispose();
            } else {
              undisposedQueryReference.releaseQuery && undisposedQueryReference.releaseQuery();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, [queryReference, isMountedRef, queryLoaderCallback, preloadableRequest]);
  useEffect(function () {
    return function disposeAllRemainingQueryReferences() {
      var _iterator2 = (0, _createForOfIteratorHelper2["default"])(undisposedQueryReferencesRef.current),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var undisposedQueryReference = _step2.value;
          if (undisposedQueryReference.kind !== 'NullQueryReference') {
            if (requestIsLiveQuery(preloadableRequest)) {
              undisposedQueryReference.dispose && undisposedQueryReference.dispose();
            } else {
              undisposedQueryReference.releaseQuery && undisposedQueryReference.releaseQuery();
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };
  }, [preloadableRequest]);
  return [queryReference.kind === 'NullQueryReference' ? null : queryReference, queryLoaderCallback, disposeQuery];
}
module.exports = useQueryLoader;