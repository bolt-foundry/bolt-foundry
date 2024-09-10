'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var LRUCache = require('./LRUCache');
var SuspenseResource = require('./SuspenseResource');
var invariant = require('invariant');
var _require = require('relay-runtime'),
  isPromise = _require.isPromise;
var warning = require("fbjs/lib/warning");
var CACHE_CAPACITY = 1000;
var DEFAULT_FETCH_POLICY = 'store-or-network';
var DEFAULT_LIVE_FETCH_POLICY = 'store-and-network';
var WEAKMAP_SUPPORTED = typeof WeakMap === 'function';
function operationIsLiveQuery(operation) {
  return operation.request.node.params.metadata.live !== undefined;
}
function getQueryCacheIdentifier(environment, operation, maybeFetchPolicy, maybeRenderPolicy, cacheBreaker) {
  var fetchPolicy = maybeFetchPolicy !== null && maybeFetchPolicy !== void 0 ? maybeFetchPolicy : operationIsLiveQuery(operation) ? DEFAULT_LIVE_FETCH_POLICY : DEFAULT_FETCH_POLICY;
  var renderPolicy = maybeRenderPolicy !== null && maybeRenderPolicy !== void 0 ? maybeRenderPolicy : environment.UNSTABLE_getDefaultRenderPolicy();
  var cacheIdentifier = "".concat(fetchPolicy, "-").concat(renderPolicy, "-").concat(operation.request.identifier);
  if (cacheBreaker != null) {
    return "".concat(cacheIdentifier, "-").concat(cacheBreaker);
  }
  return cacheIdentifier;
}
function getQueryResult(operation, cacheIdentifier) {
  var rootFragmentRef = {
    __id: operation.fragment.dataID,
    __fragments: (0, _defineProperty2["default"])({}, operation.fragment.node.name, operation.request.variables),
    __fragmentOwner: operation.request
  };
  return {
    cacheIdentifier: cacheIdentifier,
    fragmentNode: operation.request.node.fragment,
    fragmentRef: rootFragmentRef,
    operation: operation
  };
}
var nextID = 200000;
function createCacheEntry(cacheIdentifier, operation, operationAvailability, value, networkSubscription, onDispose) {
  var isLiveQuery = operationIsLiveQuery(operation);
  var currentValue = value;
  var currentNetworkSubscription = networkSubscription;
  var suspenseResource = new SuspenseResource(function (environment) {
    var retention = environment.retain(operation);
    return {
      dispose: function dispose() {
        if (isLiveQuery && currentNetworkSubscription != null) {
          currentNetworkSubscription.unsubscribe();
        }
        retention.dispose();
        onDispose(cacheEntry);
      }
    };
  });
  var cacheEntry = {
    cacheIdentifier: cacheIdentifier,
    id: nextID++,
    processedPayloadsCount: 0,
    operationAvailability: operationAvailability,
    getValue: function getValue() {
      return currentValue;
    },
    setValue: function setValue(val) {
      currentValue = val;
    },
    setNetworkSubscription: function setNetworkSubscription(subscription) {
      if (isLiveQuery && currentNetworkSubscription != null) {
        currentNetworkSubscription.unsubscribe();
      }
      currentNetworkSubscription = subscription;
    },
    temporaryRetain: function temporaryRetain(environment) {
      return suspenseResource.temporaryRetain(environment);
    },
    permanentRetain: function permanentRetain(environment) {
      return suspenseResource.permanentRetain(environment);
    },
    releaseTemporaryRetain: function releaseTemporaryRetain() {
      suspenseResource.releaseTemporaryRetain();
    }
  };
  return cacheEntry;
}
var QueryResourceImpl = /*#__PURE__*/function () {
  function QueryResourceImpl(environment) {
    var _this = this;
    (0, _defineProperty2["default"])(this, "_clearCacheEntry", function (cacheEntry) {
      _this._cache["delete"](cacheEntry.cacheIdentifier);
    });
    this._environment = environment;
    this._cache = LRUCache.create(CACHE_CAPACITY);
  }
  var _proto = QueryResourceImpl.prototype;
  _proto.prepare = function prepare(operation, fetchObservable, maybeFetchPolicy, maybeRenderPolicy, observer, cacheBreaker, profilerContext) {
    var cacheIdentifier = getQueryCacheIdentifier(this._environment, operation, maybeFetchPolicy, maybeRenderPolicy, cacheBreaker);
    return this.prepareWithIdentifier(cacheIdentifier, operation, fetchObservable, maybeFetchPolicy, maybeRenderPolicy, observer, profilerContext);
  };
  _proto.prepareWithIdentifier = function prepareWithIdentifier(cacheIdentifier, operation, fetchObservable, maybeFetchPolicy, maybeRenderPolicy, observer, profilerContext) {
    var environment = this._environment;
    var fetchPolicy = maybeFetchPolicy !== null && maybeFetchPolicy !== void 0 ? maybeFetchPolicy : operationIsLiveQuery(operation) ? DEFAULT_LIVE_FETCH_POLICY : DEFAULT_FETCH_POLICY;
    var renderPolicy = maybeRenderPolicy !== null && maybeRenderPolicy !== void 0 ? maybeRenderPolicy : environment.UNSTABLE_getDefaultRenderPolicy();
    var cacheEntry = this._cache.get(cacheIdentifier);
    var temporaryRetainDisposable = null;
    var entryWasCached = cacheEntry != null;
    if (cacheEntry == null) {
      cacheEntry = this._fetchAndSaveQuery(cacheIdentifier, operation, fetchObservable, fetchPolicy, renderPolicy, profilerContext, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, observer), {}, {
        unsubscribe: function unsubscribe(subscription) {
          if (temporaryRetainDisposable != null) {
            temporaryRetainDisposable.dispose();
          }
          var observerUnsubscribe = observer === null || observer === void 0 ? void 0 : observer.unsubscribe;
          observerUnsubscribe && observerUnsubscribe(subscription);
        }
      }));
    }
    temporaryRetainDisposable = cacheEntry.temporaryRetain(environment);
    var cachedValue = cacheEntry.getValue();
    if (isPromise(cachedValue)) {
      environment.__log({
        name: 'suspense.query',
        fetchPolicy: fetchPolicy,
        isPromiseCached: entryWasCached,
        operation: operation,
        queryAvailability: cacheEntry.operationAvailability,
        renderPolicy: renderPolicy
      });
      throw cachedValue;
    }
    if (cachedValue instanceof Error) {
      throw cachedValue;
    }
    return cachedValue;
  };
  _proto.retain = function retain(queryResult, profilerContext) {
    var environment = this._environment;
    var cacheIdentifier = queryResult.cacheIdentifier,
      operation = queryResult.operation;
    var cacheEntry = this._getOrCreateCacheEntry(cacheIdentifier, operation, null, queryResult, null);
    var disposable = cacheEntry.permanentRetain(environment);
    environment.__log({
      name: 'queryresource.retain',
      profilerContext: profilerContext,
      resourceID: cacheEntry.id
    });
    return {
      dispose: function dispose() {
        disposable.dispose();
      }
    };
  };
  _proto.releaseTemporaryRetain = function releaseTemporaryRetain(queryResult) {
    var cacheEntry = this._cache.get(queryResult.cacheIdentifier);
    if (cacheEntry != null) {
      cacheEntry.releaseTemporaryRetain();
    }
  };
  _proto.TESTS_ONLY__getCacheEntry = function TESTS_ONLY__getCacheEntry(operation, maybeFetchPolicy, maybeRenderPolicy, cacheBreaker) {
    var environment = this._environment;
    var cacheIdentifier = getQueryCacheIdentifier(environment, operation, maybeFetchPolicy, maybeRenderPolicy, cacheBreaker);
    return this._cache.get(cacheIdentifier);
  };
  _proto._getOrCreateCacheEntry = function _getOrCreateCacheEntry(cacheIdentifier, operation, operationAvailability, value, networkSubscription) {
    var cacheEntry = this._cache.get(cacheIdentifier);
    if (cacheEntry == null) {
      cacheEntry = createCacheEntry(cacheIdentifier, operation, operationAvailability, value, networkSubscription, this._clearCacheEntry);
      this._cache.set(cacheIdentifier, cacheEntry);
    }
    return cacheEntry;
  };
  _proto._fetchAndSaveQuery = function _fetchAndSaveQuery(cacheIdentifier, operation, fetchObservable, fetchPolicy, renderPolicy, profilerContext, observer) {
    var _this2 = this;
    var environment = this._environment;
    var queryAvailability = environment.check(operation);
    var queryStatus = queryAvailability.status;
    var hasFullQuery = queryStatus === 'available';
    var canPartialRender = hasFullQuery || renderPolicy === 'partial' && queryStatus !== 'stale';
    var shouldFetch;
    var shouldAllowRender;
    var resolveNetworkPromise = function resolveNetworkPromise() {};
    switch (fetchPolicy) {
      case 'store-only':
        {
          shouldFetch = false;
          shouldAllowRender = true;
          break;
        }
      case 'store-or-network':
        {
          shouldFetch = !hasFullQuery;
          shouldAllowRender = canPartialRender;
          break;
        }
      case 'store-and-network':
        {
          shouldFetch = true;
          shouldAllowRender = canPartialRender;
          break;
        }
      case 'network-only':
      default:
        {
          shouldFetch = true;
          shouldAllowRender = false;
          break;
        }
    }
    if (shouldAllowRender) {
      var queryResult = getQueryResult(operation, cacheIdentifier);
      var _cacheEntry = createCacheEntry(cacheIdentifier, operation, queryAvailability, queryResult, null, this._clearCacheEntry);
      this._cache.set(cacheIdentifier, _cacheEntry);
    }
    if (shouldFetch) {
      var _queryResult = getQueryResult(operation, cacheIdentifier);
      var networkSubscription;
      fetchObservable.subscribe({
        start: function start(subscription) {
          networkSubscription = subscription;
          var cacheEntry = _this2._cache.get(cacheIdentifier);
          if (cacheEntry) {
            cacheEntry.setNetworkSubscription(networkSubscription);
          }
          var observerStart = observer === null || observer === void 0 ? void 0 : observer.start;
          if (observerStart) {
            var subscriptionWithConditionalCancelation = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, subscription), {}, {
              unsubscribe: function unsubscribe() {
                if (operationIsLiveQuery(operation)) {
                  subscription.unsubscribe();
                }
              }
            });
            observerStart(subscriptionWithConditionalCancelation);
          }
        },
        next: function next() {
          var cacheEntry = _this2._getOrCreateCacheEntry(cacheIdentifier, operation, queryAvailability, _queryResult, networkSubscription);
          cacheEntry.processedPayloadsCount += 1;
          cacheEntry.setValue(_queryResult);
          resolveNetworkPromise();
          var observerNext = observer === null || observer === void 0 ? void 0 : observer.next;
          if (observerNext != null) {
            var snapshot = environment.lookup(operation.fragment);
            observerNext(snapshot);
          }
        },
        error: function error(_error) {
          var cacheEntry = _this2._getOrCreateCacheEntry(cacheIdentifier, operation, queryAvailability, _error, networkSubscription);
          if (cacheEntry.processedPayloadsCount === 0) {
            cacheEntry.setValue(_error);
          } else {
            process.env.NODE_ENV !== "production" ? warning(false, 'QueryResource: An incremental payload for query `%s` returned an error: `%s`.', operation.fragment.node.name, String(_error.message)) : void 0;
          }
          resolveNetworkPromise();
          networkSubscription = null;
          cacheEntry.setNetworkSubscription(null);
          var observerError = observer === null || observer === void 0 ? void 0 : observer.error;
          observerError && observerError(_error);
        },
        complete: function complete() {
          resolveNetworkPromise();
          networkSubscription = null;
          var cacheEntry = _this2._cache.get(cacheIdentifier);
          if (cacheEntry) {
            cacheEntry.setNetworkSubscription(null);
          }
          var observerComplete = observer === null || observer === void 0 ? void 0 : observer.complete;
          observerComplete && observerComplete();
        },
        unsubscribe: observer === null || observer === void 0 ? void 0 : observer.unsubscribe
      });
      var _cacheEntry2 = this._cache.get(cacheIdentifier);
      if (!_cacheEntry2) {
        var networkPromise = new Promise(function (resolve) {
          resolveNetworkPromise = resolve;
        });
        networkPromise.displayName = 'Relay(' + operation.fragment.node.name + ')';
        _cacheEntry2 = createCacheEntry(cacheIdentifier, operation, queryAvailability, networkPromise, networkSubscription, this._clearCacheEntry);
        this._cache.set(cacheIdentifier, _cacheEntry2);
      }
    } else {
      var observerComplete = observer === null || observer === void 0 ? void 0 : observer.complete;
      observerComplete && observerComplete();
    }
    var cacheEntry = this._cache.get(cacheIdentifier);
    !(cacheEntry != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to have cached a result when attempting to fetch query.' + "If you're seeing this, this is likely a bug in Relay.") : invariant(false) : void 0;
    environment.__log({
      name: 'queryresource.fetch',
      resourceID: cacheEntry.id,
      operation: operation,
      profilerContext: profilerContext,
      fetchPolicy: fetchPolicy,
      renderPolicy: renderPolicy,
      queryAvailability: queryAvailability,
      shouldFetch: shouldFetch
    });
    return cacheEntry;
  };
  return QueryResourceImpl;
}();
function createQueryResource(environment) {
  return new QueryResourceImpl(environment);
}
var dataResources = WEAKMAP_SUPPORTED ? new WeakMap() : new Map();
function getQueryResourceForEnvironment(environment) {
  var cached = dataResources.get(environment);
  if (cached) {
    return cached;
  }
  var newDataResource = createQueryResource(environment);
  dataResources.set(environment, newDataResource);
  return newDataResource;
}
module.exports = {
  createQueryResource: createQueryResource,
  getQueryResourceForEnvironment: getQueryResourceForEnvironment,
  getQueryCacheIdentifier: getQueryCacheIdentifier
};