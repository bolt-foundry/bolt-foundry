'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _require = require('relay-runtime'),
  Observable = _require.Observable,
  PreloadableQueryRegistry = _require.PreloadableQueryRegistry,
  ReplaySubject = _require.ReplaySubject,
  createOperationDescriptor = _require.createOperationDescriptor,
  getRequest = _require.getRequest,
  getRequestIdentifier = _require.getRequestIdentifier;
var DEFAULT_PREFETCH_TIMEOUT = 30 * 1000;
var WEAKMAP_SUPPORTED = typeof WeakMap === 'function';
var STORE_OR_NETWORK_DEFAULT = 'store-or-network';
var pendingQueriesByEnvironment = WEAKMAP_SUPPORTED ? new WeakMap() : new Map();
function preloadQuery(environment, preloadableRequest, variables, options, environmentProviderOptions) {
  var _pendingQueries = pendingQueriesByEnvironment.get(environment);
  if (_pendingQueries == null) {
    _pendingQueries = new Map();
    pendingQueriesByEnvironment.set(environment, _pendingQueries);
  }
  var pendingQueries = _pendingQueries;
  var queryEntry = preloadQueryDeduped(environment, pendingQueries, preloadableRequest, variables, options);
  var source = queryEntry.kind === 'network' ? Observable.create(function (sink) {
    var subscription;
    if (pendingQueries.get(queryEntry.cacheKey) == null) {
      var newQueryEntry = preloadQueryDeduped(environment, pendingQueries, preloadableRequest, variables, options);
      if (newQueryEntry.kind === 'network') {
        subscription = newQueryEntry.subject.subscribe(sink);
      }
    } else {
      subscription = queryEntry.subject.subscribe(sink);
    }
    return function () {
      var _subscription;
      (_subscription = subscription) === null || _subscription === void 0 ? void 0 : _subscription.unsubscribe();
      if (environment.isServer()) {
        return;
      }
      setTimeout(function () {
        if (queryEntry != null) {
          cleanup(pendingQueries, queryEntry);
        }
      }, DEFAULT_PREFETCH_TIMEOUT);
    };
  }) : null;
  return {
    kind: 'PreloadedQuery_DEPRECATED',
    environment: environment,
    environmentProviderOptions: environmentProviderOptions,
    fetchKey: queryEntry.fetchKey,
    fetchPolicy: queryEntry.fetchPolicy,
    networkCacheConfig: options === null || options === void 0 ? void 0 : options.networkCacheConfig,
    id: queryEntry.id,
    name: queryEntry.name,
    source: source,
    variables: variables,
    status: queryEntry.status
  };
}
function preloadQueryDeduped(environment, pendingQueries, preloadableRequest, variables, options) {
  var _options$fetchPolicy;
  var params;
  var query;
  if (preloadableRequest.kind === 'PreloadableConcreteRequest') {
    var preloadableConcreteRequest = preloadableRequest;
    params = preloadableConcreteRequest.params;
    query = params.id != null ? PreloadableQueryRegistry.get(params.id) : null;
  } else {
    query = getRequest(preloadableRequest);
    params = query.params;
  }
  var network = environment.getNetwork();
  var fetchPolicy = (_options$fetchPolicy = options === null || options === void 0 ? void 0 : options.fetchPolicy) !== null && _options$fetchPolicy !== void 0 ? _options$fetchPolicy : STORE_OR_NETWORK_DEFAULT;
  var fetchKey = options === null || options === void 0 ? void 0 : options.fetchKey;
  var networkCacheConfig = (0, _objectSpread2["default"])({
    force: true
  }, options === null || options === void 0 ? void 0 : options.networkCacheConfig);
  var cacheKey = "".concat(getRequestIdentifier(params, variables)).concat(fetchKey != null ? "-".concat(fetchKey) : '');
  var prevQueryEntry = pendingQueries.get(cacheKey);
  var availability = fetchPolicy === STORE_OR_NETWORK_DEFAULT && query != null && query != null ? environment.check(createOperationDescriptor(query, variables, networkCacheConfig)) : {
    status: 'missing'
  };
  var nextQueryEntry;
  if (availability.status === 'available' && query != null) {
    var _availability$fetchTi;
    nextQueryEntry = prevQueryEntry && prevQueryEntry.kind === 'cache' ? prevQueryEntry : {
      cacheKey: cacheKey,
      fetchKey: fetchKey,
      fetchPolicy: fetchPolicy,
      kind: 'cache',
      id: params.id,
      name: params.name,
      status: {
        cacheConfig: networkCacheConfig,
        source: 'cache',
        fetchTime: (_availability$fetchTi = availability === null || availability === void 0 ? void 0 : availability.fetchTime) !== null && _availability$fetchTi !== void 0 ? _availability$fetchTi : null
      }
    };
    if (!environment.isServer() && prevQueryEntry == null) {
      setTimeout(function () {
        if (nextQueryEntry != null) {
          cleanup(pendingQueries, nextQueryEntry);
        }
      }, DEFAULT_PREFETCH_TIMEOUT);
    }
  } else if (prevQueryEntry == null || prevQueryEntry.kind !== 'network') {
    var source = network.execute(params, variables, networkCacheConfig, null);
    var subject = new ReplaySubject();
    nextQueryEntry = {
      cacheKey: cacheKey,
      fetchKey: fetchKey,
      fetchPolicy: fetchPolicy,
      kind: 'network',
      id: params.id,
      name: params.name,
      status: {
        cacheConfig: networkCacheConfig,
        source: 'network',
        fetchTime: null
      },
      subject: subject,
      subscription: source["finally"](function () {
        if (environment.isServer()) {
          return;
        }
        setTimeout(function () {
          if (nextQueryEntry != null) {
            cleanup(pendingQueries, nextQueryEntry);
          }
        }, DEFAULT_PREFETCH_TIMEOUT);
      }).subscribe({
        complete: function complete() {
          subject.complete();
        },
        error: function error(_error) {
          subject.error(_error);
        },
        next: function next(response) {
          subject.next(response);
        }
      })
    };
  } else {
    nextQueryEntry = prevQueryEntry;
  }
  pendingQueries.set(cacheKey, nextQueryEntry);
  return nextQueryEntry;
}
function cleanup(pendingQueries, entry) {
  var currentEntry = pendingQueries.get(entry.cacheKey);
  if (currentEntry != null && currentEntry === entry) {
    if (currentEntry.kind === 'network') {
      currentEntry.subscription.unsubscribe();
    }
    pendingQueries["delete"](currentEntry.cacheKey);
  }
}
module.exports = preloadQuery;