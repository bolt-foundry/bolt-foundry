'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var invariant = require('invariant');
var React = require('react');
var _require = require('relay-runtime'),
  fetchQueryDeduped = _require.__internal.fetchQueryDeduped,
  Observable = _require.Observable,
  PreloadableQueryRegistry = _require.PreloadableQueryRegistry,
  RelayFeatureFlags = _require.RelayFeatureFlags,
  ReplaySubject = _require.ReplaySubject,
  createOperationDescriptor = _require.createOperationDescriptor,
  getRequest = _require.getRequest,
  getRequestIdentifier = _require.getRequestIdentifier;
var warning = require("fbjs/lib/warning");
var RenderDispatcher = null;
var fetchKey = 100001;
function useTrackLoadQueryInRender() {
  if (RenderDispatcher === null) {
    var _React$__SECRET_INTER, _React$__SECRET_INTER2;
    RenderDispatcher = (_React$__SECRET_INTER = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null || _React$__SECRET_INTER === void 0 ? void 0 : (_React$__SECRET_INTER2 = _React$__SECRET_INTER.ReactCurrentDispatcher) === null || _React$__SECRET_INTER2 === void 0 ? void 0 : _React$__SECRET_INTER2.current;
  }
}
function loadQuery(environment, preloadableRequest, variables, options, environmentProviderOptions) {
  var _React$__SECRET_INTER3, _React$__SECRET_INTER4, _options$__nameForWar, _options$fetchPolicy;
  var CurrentDispatcher = (_React$__SECRET_INTER3 = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === null || _React$__SECRET_INTER3 === void 0 ? void 0 : (_React$__SECRET_INTER4 = _React$__SECRET_INTER3.ReactCurrentDispatcher) === null || _React$__SECRET_INTER4 === void 0 ? void 0 : _React$__SECRET_INTER4.current;
  process.env.NODE_ENV !== "production" ? warning(RenderDispatcher == null || CurrentDispatcher !== RenderDispatcher, 'Relay: `%s` should not be called inside a React render function.', (_options$__nameForWar = options === null || options === void 0 ? void 0 : options.__nameForWarning) !== null && _options$__nameForWar !== void 0 ? _options$__nameForWar : 'loadQuery') : void 0;
  fetchKey++;
  var fetchPolicy = (_options$fetchPolicy = options === null || options === void 0 ? void 0 : options.fetchPolicy) !== null && _options$fetchPolicy !== void 0 ? _options$fetchPolicy : 'store-or-network';
  var networkCacheConfig = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, options === null || options === void 0 ? void 0 : options.networkCacheConfig), {}, {
    force: true
  });
  var retainReference;
  var didExecuteNetworkSource = false;
  var executeWithNetworkSource = function executeWithNetworkSource(operation, networkObservable) {
    didExecuteNetworkSource = true;
    return environment.executeWithSource({
      operation: operation,
      source: networkObservable
    });
  };
  var executionSubject = new ReplaySubject();
  var returnedObservable = Observable.create(function (sink) {
    return executionSubject.subscribe(sink);
  });
  var unsubscribeFromNetworkRequest;
  var networkError = null;
  var didMakeNetworkRequest = false;
  var makeNetworkRequest = function makeNetworkRequest(params) {
    didMakeNetworkRequest = true;
    var observable;
    var subject = new ReplaySubject();
    if (RelayFeatureFlags.ENABLE_LOAD_QUERY_REQUEST_DEDUPING === true) {
      var identifier = 'raw-network-request-' + getRequestIdentifier(params, variables);
      observable = fetchQueryDeduped(environment, identifier, function () {
        var network = environment.getNetwork();
        return network.execute(params, variables, networkCacheConfig);
      });
    } else {
      var network = environment.getNetwork();
      observable = network.execute(params, variables, networkCacheConfig);
    }
    var _observable$subscribe = observable.subscribe({
        error: function error(err) {
          networkError = err;
          subject.error(err);
        },
        next: function next(data) {
          subject.next(data);
        },
        complete: function complete() {
          subject.complete();
        }
      }),
      unsubscribe = _observable$subscribe.unsubscribe;
    unsubscribeFromNetworkRequest = unsubscribe;
    return Observable.create(function (sink) {
      var subjectSubscription = subject.subscribe(sink);
      return function () {
        subjectSubscription.unsubscribe();
        unsubscribeFromNetworkRequest();
      };
    });
  };
  var unsubscribeFromExecution;
  var executeDeduped = function executeDeduped(operation, fetchFn) {
    if (RelayFeatureFlags.ENABLE_LOAD_QUERY_REQUEST_DEDUPING === true) {
      didMakeNetworkRequest = true;
    }
    var _fetchQueryDeduped$su = fetchQueryDeduped(environment, operation.request.identifier, fetchFn).subscribe({
      error: function error(err) {
        executionSubject.error(err);
      },
      next: function next(data) {
        executionSubject.next(data);
      },
      complete: function complete() {
        executionSubject.complete();
      }
    });
    unsubscribeFromExecution = _fetchQueryDeduped$su.unsubscribe;
  };
  var checkAvailabilityAndExecute = function checkAvailabilityAndExecute(concreteRequest) {
    var operation = createOperationDescriptor(concreteRequest, variables, networkCacheConfig);
    retainReference = environment.retain(operation);
    if (fetchPolicy === 'store-only') {
      return;
    }
    var shouldFetch = fetchPolicy !== 'store-or-network' || environment.check(operation).status !== 'available';
    if (shouldFetch) {
      executeDeduped(operation, function () {
        var networkObservable = makeNetworkRequest(concreteRequest.params);
        var executeObservable = executeWithNetworkSource(operation, networkObservable);
        return executeObservable;
      });
    }
  };
  var params;
  var cancelOnLoadCallback;
  var queryId;
  if (preloadableRequest.kind === 'PreloadableConcreteRequest') {
    var preloadableConcreteRequest = preloadableRequest;
    params = preloadableConcreteRequest.params;
    var _params = params;
    queryId = _params.id;
    !(queryId !== null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: `loadQuery` requires that preloadable query `%s` has a persisted query id', params.name) : invariant(false) : void 0;
    var _module = PreloadableQueryRegistry.get(queryId);
    if (_module != null) {
      checkAvailabilityAndExecute(_module);
    } else {
      var networkObservable = fetchPolicy === 'store-only' ? null : makeNetworkRequest(params);
      var _PreloadableQueryRegi = PreloadableQueryRegistry.onLoad(queryId, function (preloadedModule) {
        cancelOnLoadCallback();
        var operation = createOperationDescriptor(preloadedModule, variables, networkCacheConfig);
        retainReference = environment.retain(operation);
        if (networkObservable != null) {
          executeDeduped(operation, function () {
            return executeWithNetworkSource(operation, networkObservable);
          });
        }
      });
      cancelOnLoadCallback = _PreloadableQueryRegi.dispose;
    }
  } else {
    var graphQlTaggedNode = preloadableRequest;
    var request = getRequest(graphQlTaggedNode);
    params = request.params;
    queryId = params.cacheID != null ? params.cacheID : params.id;
    checkAvailabilityAndExecute(request);
  }
  var isDisposed = false;
  var isReleased = false;
  var isNetworkRequestCancelled = false;
  var releaseQuery = function releaseQuery() {
    if (isReleased) {
      return;
    }
    retainReference && retainReference.dispose();
    isReleased = true;
  };
  var cancelNetworkRequest = function cancelNetworkRequest() {
    if (isNetworkRequestCancelled) {
      return;
    }
    if (didExecuteNetworkSource) {
      unsubscribeFromExecution && unsubscribeFromExecution();
    } else {
      unsubscribeFromNetworkRequest && unsubscribeFromNetworkRequest();
    }
    cancelOnLoadCallback && cancelOnLoadCallback();
    isNetworkRequestCancelled = true;
  };
  return {
    kind: 'PreloadedQuery',
    environment: environment,
    environmentProviderOptions: environmentProviderOptions,
    dispose: function dispose() {
      if (isDisposed) {
        return;
      }
      releaseQuery();
      cancelNetworkRequest();
      isDisposed = true;
    },
    releaseQuery: releaseQuery,
    cancelNetworkRequest: cancelNetworkRequest,
    fetchKey: fetchKey,
    id: queryId,
    get isDisposed() {
      return isDisposed || isReleased;
    },
    get networkError() {
      return networkError;
    },
    name: params.name,
    networkCacheConfig: networkCacheConfig,
    fetchPolicy: fetchPolicy,
    source: didMakeNetworkRequest ? returnedObservable : undefined,
    variables: variables
  };
}
module.exports = {
  loadQuery: loadQuery,
  useTrackLoadQueryInRender: useTrackLoadQueryInRender
};