'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var LRUCache = require('./LRUCache');
var _require = require('./QueryResource'),
  getQueryResourceForEnvironment = _require.getQueryResourceForEnvironment;
var SuspenseResource = require('./SuspenseResource');
var invariant = require('invariant');
var _require2 = require('relay-runtime'),
  _require2$__internal = _require2.__internal,
  fetchQuery = _require2$__internal.fetchQuery,
  getPromiseForActiveRequest = _require2$__internal.getPromiseForActiveRequest,
  RelayFeatureFlags = _require2.RelayFeatureFlags,
  createOperationDescriptor = _require2.createOperationDescriptor,
  getFragmentIdentifier = _require2.getFragmentIdentifier,
  getPendingOperationsForFragment = _require2.getPendingOperationsForFragment,
  getSelector = _require2.getSelector,
  getVariablesFromFragment = _require2.getVariablesFromFragment,
  handlePotentialSnapshotErrors = _require2.handlePotentialSnapshotErrors,
  isPromise = _require2.isPromise,
  recycleNodesInto = _require2.recycleNodesInto;
var WEAKMAP_SUPPORTED = typeof WeakMap === 'function';
var CACHE_CAPACITY = 1000000;
var CONSTANT_READONLY_EMPTY_ARRAY = Object.freeze([]);
function isMissingData(snapshot) {
  if (Array.isArray(snapshot)) {
    return snapshot.some(function (s) {
      return s.isMissingData;
    });
  }
  return snapshot.isMissingData;
}
function hasMissingClientEdges(snapshot) {
  var _snapshot$missingClie, _snapshot$missingClie2;
  if (Array.isArray(snapshot)) {
    return snapshot.some(function (s) {
      var _s$missingClientEdges, _s$missingClientEdges2;
      return ((_s$missingClientEdges = (_s$missingClientEdges2 = s.missingClientEdges) === null || _s$missingClientEdges2 === void 0 ? void 0 : _s$missingClientEdges2.length) !== null && _s$missingClientEdges !== void 0 ? _s$missingClientEdges : 0) > 0;
    });
  }
  return ((_snapshot$missingClie = (_snapshot$missingClie2 = snapshot.missingClientEdges) === null || _snapshot$missingClie2 === void 0 ? void 0 : _snapshot$missingClie2.length) !== null && _snapshot$missingClie !== void 0 ? _snapshot$missingClie : 0) > 0;
}
function missingLiveResolverFields(snapshot) {
  if (Array.isArray(snapshot)) {
    return snapshot.map(function (s) {
      return s.missingLiveResolverFields;
    }).filter(Boolean).flat();
  }
  return snapshot.missingLiveResolverFields;
}
function singularOrPluralForEach(snapshot, f) {
  if (Array.isArray(snapshot)) {
    snapshot.forEach(f);
  } else {
    f(snapshot);
  }
}
function getFragmentResult(cacheKey, snapshot, storeEpoch) {
  if (Array.isArray(snapshot)) {
    return {
      cacheKey: cacheKey,
      snapshot: snapshot,
      data: snapshot.map(function (s) {
        return s.data;
      }),
      isMissingData: isMissingData(snapshot),
      storeEpoch: storeEpoch
    };
  }
  return {
    cacheKey: cacheKey,
    snapshot: snapshot,
    data: snapshot.data,
    isMissingData: isMissingData(snapshot),
    storeEpoch: storeEpoch
  };
}
var ClientEdgeQueryResultsCache = /*#__PURE__*/function () {
  function ClientEdgeQueryResultsCache(environment) {
    (0, _defineProperty2["default"])(this, "_cache", new Map());
    (0, _defineProperty2["default"])(this, "_retainCounts", new Map());
    this._environment = environment;
  }
  var _proto = ClientEdgeQueryResultsCache.prototype;
  _proto.get = function get(fragmentIdentifier) {
    var _this$_cache$get$, _this$_cache$get;
    return (_this$_cache$get$ = (_this$_cache$get = this._cache.get(fragmentIdentifier)) === null || _this$_cache$get === void 0 ? void 0 : _this$_cache$get[0]) !== null && _this$_cache$get$ !== void 0 ? _this$_cache$get$ : undefined;
  };
  _proto.recordQueryResults = function recordQueryResults(fragmentIdentifier, value) {
    var _this = this;
    var existing = this._cache.get(fragmentIdentifier);
    if (!existing) {
      var suspenseResource = new SuspenseResource(function () {
        return _this._retain(fragmentIdentifier);
      });
      this._cache.set(fragmentIdentifier, [value, suspenseResource]);
      suspenseResource.temporaryRetain(this._environment);
    } else {
      var existingResults = existing[0],
        _suspenseResource = existing[1];
      value.forEach(function (queryResult) {
        existingResults.push(queryResult);
      });
      _suspenseResource.temporaryRetain(this._environment);
    }
  };
  _proto._retain = function _retain(id) {
    var _this2 = this;
    var _this$_retainCounts$g;
    var retainCount = ((_this$_retainCounts$g = this._retainCounts.get(id)) !== null && _this$_retainCounts$g !== void 0 ? _this$_retainCounts$g : 0) + 1;
    this._retainCounts.set(id, retainCount);
    return {
      dispose: function dispose() {
        var _this$_retainCounts$g2;
        var newRetainCount = ((_this$_retainCounts$g2 = _this2._retainCounts.get(id)) !== null && _this$_retainCounts$g2 !== void 0 ? _this$_retainCounts$g2 : 0) - 1;
        if (newRetainCount > 0) {
          _this2._retainCounts.set(id, newRetainCount);
        } else {
          _this2._retainCounts["delete"](id);
          _this2._cache["delete"](id);
        }
      }
    };
  };
  return ClientEdgeQueryResultsCache;
}();
var FragmentResourceImpl = /*#__PURE__*/function () {
  function FragmentResourceImpl(environment) {
    this._environment = environment;
    this._cache = LRUCache.create(CACHE_CAPACITY);
    if (RelayFeatureFlags.ENABLE_CLIENT_EDGES) {
      this._clientEdgeQueryResultsCache = new ClientEdgeQueryResultsCache(environment);
    }
  }
  var _proto2 = FragmentResourceImpl.prototype;
  _proto2.read = function read(fragmentNode, fragmentRef, componentDisplayName, fragmentKey) {
    return this.readWithIdentifier(fragmentNode, fragmentRef, getFragmentIdentifier(fragmentNode, fragmentRef), componentDisplayName, fragmentKey);
  };
  _proto2.readWithIdentifier = function readWithIdentifier(fragmentNode, fragmentRef, fragmentIdentifier, componentDisplayName, fragmentKey) {
    var _this3 = this;
    var _fragmentNode$metadat, _fragmentNode$metadat2, _missingLiveResolverF2, _missingLiveResolverF3;
    var environment = this._environment;
    if (fragmentRef == null) {
      return {
        cacheKey: fragmentIdentifier,
        data: null,
        isMissingData: false,
        snapshot: null,
        storeEpoch: 0
      };
    }
    var storeEpoch = environment.getStore().getEpoch();
    if ((fragmentNode === null || fragmentNode === void 0 ? void 0 : (_fragmentNode$metadat = fragmentNode.metadata) === null || _fragmentNode$metadat === void 0 ? void 0 : _fragmentNode$metadat.plural) === true) {
      !Array.isArray(fragmentRef) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected fragment pointer%s for fragment `%s` to be ' + 'an array, instead got `%s`. Remove `@relay(plural: true)` ' + 'from fragment `%s` to allow the prop to be an object.', fragmentKey != null ? " for key `".concat(fragmentKey, "`") : '', fragmentNode.name, typeof fragmentRef, fragmentNode.name) : invariant(false) : void 0;
      if (fragmentRef.length === 0) {
        return {
          cacheKey: fragmentIdentifier,
          data: CONSTANT_READONLY_EMPTY_ARRAY,
          isMissingData: false,
          snapshot: CONSTANT_READONLY_EMPTY_ARRAY,
          storeEpoch: storeEpoch
        };
      }
    }
    var cachedValue = this._cache.get(fragmentIdentifier);
    if (cachedValue != null) {
      var _missingLiveResolverF;
      if (cachedValue.kind === 'pending' && isPromise(cachedValue.promise)) {
        environment.__log({
          name: 'suspense.fragment',
          data: cachedValue.result.data,
          fragment: fragmentNode,
          isRelayHooks: true,
          isMissingData: cachedValue.result.isMissingData,
          isPromiseCached: true,
          pendingOperations: cachedValue.pendingOperations
        });
        throw cachedValue.promise;
      }
      if (cachedValue.kind === 'done' && cachedValue.result.snapshot && !((_missingLiveResolverF = missingLiveResolverFields(cachedValue.result.snapshot)) !== null && _missingLiveResolverF !== void 0 && _missingLiveResolverF.length)) {
        this._throwOrLogErrorsInSnapshot(cachedValue.result.snapshot);
        if (cachedValue.result.isMissingData) {
          environment.__log({
            name: 'fragmentresource.missing_data',
            data: cachedValue.result.data,
            fragment: fragmentNode,
            isRelayHooks: true,
            cached: true
          });
        }
        return cachedValue.result;
      }
    }
    var fragmentSelector = getSelector(fragmentNode, fragmentRef);
    !(fragmentSelector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to receive an object where `...%s` was spread, ' + 'but the fragment reference was not found`. This is most ' + 'likely the result of:\n' + "- Forgetting to spread `%s` in `%s`'s parent's fragment.\n" + '- Conditionally fetching `%s` but unconditionally passing %s prop ' + 'to `%s`. If the parent fragment only fetches the fragment conditionally ' + '- with e.g. `@include`, `@skip`, or inside a `... on SomeType { }` ' + 'spread  - then the fragment reference will not exist. ' + 'In this case, pass `null` if the conditions for evaluating the ' + 'fragment are not met (e.g. if the `@include(if)` value is false.)', fragmentNode.name, fragmentNode.name, componentDisplayName, fragmentNode.name, fragmentKey == null ? 'a fragment reference' : "the `".concat(fragmentKey, "`"), componentDisplayName) : invariant(false) : void 0;
    var fragmentResult = null;
    var snapshot = null;
    if (RelayFeatureFlags.ENABLE_RELAY_OPERATION_TRACKER_SUSPENSE && cachedValue != null && cachedValue.kind === 'missing') {
      fragmentResult = cachedValue.result;
      snapshot = cachedValue.snapshot;
    } else {
      snapshot = fragmentSelector.kind === 'PluralReaderSelector' ? fragmentSelector.selectors.map(function (s) {
        return environment.lookup(s);
      }) : environment.lookup(fragmentSelector);
      fragmentResult = getFragmentResult(fragmentIdentifier, snapshot, storeEpoch);
    }
    if (!fragmentResult.isMissingData) {
      this._throwOrLogErrorsInSnapshot(snapshot);
      this._cache.set(fragmentIdentifier, {
        kind: 'done',
        result: fragmentResult
      });
      return fragmentResult;
    }
    var clientEdgeRequests = null;
    if (RelayFeatureFlags.ENABLE_CLIENT_EDGES && ((_fragmentNode$metadat2 = fragmentNode.metadata) === null || _fragmentNode$metadat2 === void 0 ? void 0 : _fragmentNode$metadat2.hasClientEdges) === true && hasMissingClientEdges(snapshot)) {
      clientEdgeRequests = [];
      var queryResource = getQueryResourceForEnvironment(this._environment);
      var queryResults = [];
      singularOrPluralForEach(snapshot, function (snap) {
        var _snap$missingClientEd;
        (_snap$missingClientEd = snap.missingClientEdges) === null || _snap$missingClientEd === void 0 ? void 0 : _snap$missingClientEd.forEach(function (_ref) {
          var _clientEdgeRequests;
          var request = _ref.request,
            clientEdgeDestinationID = _ref.clientEdgeDestinationID;
          var _this3$_performClient = _this3._performClientEdgeQuery(queryResource, fragmentNode, fragmentRef, request, clientEdgeDestinationID),
            queryResult = _this3$_performClient.queryResult,
            requestDescriptor = _this3$_performClient.requestDescriptor;
          queryResults.push(queryResult);
          (_clientEdgeRequests = clientEdgeRequests) === null || _clientEdgeRequests === void 0 ? void 0 : _clientEdgeRequests.push(requestDescriptor);
        });
      });
      !(this._clientEdgeQueryResultsCache != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Client edge query result cache should exist when ENABLE_CLIENT_EDGES is on.') : invariant(false) : void 0;
      this._clientEdgeQueryResultsCache.recordQueryResults(fragmentIdentifier, queryResults);
    }
    var clientEdgePromises = [];
    if (RelayFeatureFlags.ENABLE_CLIENT_EDGES && clientEdgeRequests) {
      clientEdgePromises = clientEdgeRequests.map(function (request) {
        return getPromiseForActiveRequest(_this3._environment, request);
      }).filter(Boolean);
    }
    var fragmentOwner = fragmentSelector.kind === 'PluralReaderSelector' ? fragmentSelector.selectors[0].owner : fragmentSelector.owner;
    var parentQueryPromiseResult = this._getAndSavePromiseForFragmentRequestInFlight(fragmentIdentifier, fragmentNode, fragmentOwner, fragmentResult);
    var parentQueryPromiseResultPromise = parentQueryPromiseResult === null || parentQueryPromiseResult === void 0 ? void 0 : parentQueryPromiseResult.promise;
    var missingResolverFieldPromises = (_missingLiveResolverF2 = (_missingLiveResolverF3 = missingLiveResolverFields(snapshot)) === null || _missingLiveResolverF3 === void 0 ? void 0 : _missingLiveResolverF3.map(function (_ref2) {
      var liveStateID = _ref2.liveStateID;
      var store = environment.getStore();
      return store.getLiveResolverPromise(liveStateID);
    })) !== null && _missingLiveResolverF2 !== void 0 ? _missingLiveResolverF2 : [];
    if (clientEdgePromises.length || missingResolverFieldPromises.length || isPromise(parentQueryPromiseResultPromise)) {
      var _parentQueryPromiseRe, _clientEdgeRequests2;
      environment.__log({
        name: 'suspense.fragment',
        data: fragmentResult.data,
        fragment: fragmentNode,
        isRelayHooks: true,
        isPromiseCached: false,
        isMissingData: fragmentResult.isMissingData,
        pendingOperations: [].concat((0, _toConsumableArray2["default"])((_parentQueryPromiseRe = parentQueryPromiseResult === null || parentQueryPromiseResult === void 0 ? void 0 : parentQueryPromiseResult.pendingOperations) !== null && _parentQueryPromiseRe !== void 0 ? _parentQueryPromiseRe : []), (0, _toConsumableArray2["default"])((_clientEdgeRequests2 = clientEdgeRequests) !== null && _clientEdgeRequests2 !== void 0 ? _clientEdgeRequests2 : []))
      });
      var promises = [];
      if (clientEdgePromises.length > 0) {
        promises = promises.concat(clientEdgePromises);
      }
      if (missingResolverFieldPromises.length > 0) {
        promises = promises.concat(missingResolverFieldPromises);
      }
      if (promises.length > 0) {
        if (parentQueryPromiseResultPromise) {
          promises.push(parentQueryPromiseResultPromise);
        }
        throw Promise.all(promises);
      }
      if (parentQueryPromiseResultPromise) {
        throw parentQueryPromiseResultPromise;
      }
    }
    if (RelayFeatureFlags.ENABLE_RELAY_OPERATION_TRACKER_SUSPENSE && fragmentResult.isMissingData) {
      this._cache.set(fragmentIdentifier, {
        kind: 'done',
        result: fragmentResult
      });
    }
    this._throwOrLogErrorsInSnapshot(snapshot);
    environment.__log({
      name: 'fragmentresource.missing_data',
      data: fragmentResult.data,
      fragment: fragmentNode,
      isRelayHooks: true,
      cached: false
    });
    return getFragmentResult(fragmentIdentifier, snapshot, storeEpoch);
  };
  _proto2._performClientEdgeQuery = function _performClientEdgeQuery(queryResource, fragmentNode, fragmentRef, request, clientEdgeDestinationID) {
    var originalVariables = getVariablesFromFragment(fragmentNode, fragmentRef);
    var variables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, originalVariables), {}, {
      id: clientEdgeDestinationID
    });
    var operation = createOperationDescriptor(request, variables, {});
    var fetchObservable = fetchQuery(this._environment, operation);
    var queryResult = queryResource.prepare(operation, fetchObservable);
    return {
      requestDescriptor: operation.request,
      queryResult: queryResult
    };
  };
  _proto2._throwOrLogErrorsInSnapshot = function _throwOrLogErrorsInSnapshot(snapshot) {
    var _this4 = this;
    if (Array.isArray(snapshot)) {
      snapshot.forEach(function (s) {
        handlePotentialSnapshotErrors(_this4._environment, s.missingRequiredFields, s.relayResolverErrors);
      });
    } else {
      handlePotentialSnapshotErrors(this._environment, snapshot.missingRequiredFields, snapshot.relayResolverErrors);
    }
  };
  _proto2.readSpec = function readSpec(fragmentNodes, fragmentRefs, componentDisplayName) {
    var result = {};
    for (var key in fragmentNodes) {
      result[key] = this.read(fragmentNodes[key], fragmentRefs[key], componentDisplayName, key);
    }
    return result;
  };
  _proto2.subscribe = function subscribe(fragmentResult, callback) {
    var _this5 = this;
    var environment = this._environment;
    var cacheKey = fragmentResult.cacheKey;
    var renderedSnapshot = fragmentResult.snapshot;
    if (!renderedSnapshot) {
      return {
        dispose: function dispose() {}
      };
    }
    var _this$checkMissedUpda = this.checkMissedUpdates(fragmentResult),
      didMissUpdates = _this$checkMissedUpda[0],
      currentSnapshot = _this$checkMissedUpda[1];
    if (didMissUpdates) {
      callback();
    }
    var disposables = [];
    if (Array.isArray(renderedSnapshot)) {
      !Array.isArray(currentSnapshot) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected snapshots to be plural. ' + "If you're seeing this, this is likely a bug in Relay.") : invariant(false) : void 0;
      currentSnapshot.forEach(function (snapshot, idx) {
        disposables.push(environment.subscribe(snapshot, function (latestSnapshot) {
          var storeEpoch = environment.getStore().getEpoch();
          _this5._updatePluralSnapshot(cacheKey, currentSnapshot, latestSnapshot, idx, storeEpoch);
          callback();
        }));
      });
    } else {
      !(currentSnapshot != null && !Array.isArray(currentSnapshot)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected snapshot to be singular. ' + "If you're seeing this, this is likely a bug in Relay.") : invariant(false) : void 0;
      disposables.push(environment.subscribe(currentSnapshot, function (latestSnapshot) {
        var storeEpoch = environment.getStore().getEpoch();
        var result = getFragmentResult(cacheKey, latestSnapshot, storeEpoch);
        if (RelayFeatureFlags.ENABLE_RELAY_OPERATION_TRACKER_SUSPENSE && result.isMissingData) {
          _this5._cache.set(cacheKey, {
            kind: 'missing',
            result: result,
            snapshot: latestSnapshot
          });
        } else {
          _this5._cache.set(cacheKey, {
            kind: 'done',
            result: getFragmentResult(cacheKey, latestSnapshot, storeEpoch)
          });
        }
        callback();
      }));
    }
    if (RelayFeatureFlags.ENABLE_CLIENT_EDGES) {
      var _this$_clientEdgeQuer, _this$_clientEdgeQuer2;
      var clientEdgeQueryResults = (_this$_clientEdgeQuer = (_this$_clientEdgeQuer2 = this._clientEdgeQueryResultsCache) === null || _this$_clientEdgeQuer2 === void 0 ? void 0 : _this$_clientEdgeQuer2.get(cacheKey)) !== null && _this$_clientEdgeQuer !== void 0 ? _this$_clientEdgeQuer : undefined;
      if (clientEdgeQueryResults !== null && clientEdgeQueryResults !== void 0 && clientEdgeQueryResults.length) {
        var queryResource = getQueryResourceForEnvironment(this._environment);
        clientEdgeQueryResults.forEach(function (queryResult) {
          disposables.push(queryResource.retain(queryResult));
        });
      }
    }
    return {
      dispose: function dispose() {
        disposables.forEach(function (s) {
          return s.dispose();
        });
        _this5._cache["delete"](cacheKey);
      }
    };
  };
  _proto2.subscribeSpec = function subscribeSpec(fragmentResults, callback) {
    var _this6 = this;
    var disposables = Object.keys(fragmentResults).map(function (key) {
      return _this6.subscribe(fragmentResults[key], callback);
    });
    return {
      dispose: function dispose() {
        disposables.forEach(function (disposable) {
          disposable.dispose();
        });
      }
    };
  };
  _proto2.checkMissedUpdates = function checkMissedUpdates(fragmentResult) {
    var environment = this._environment;
    var renderedSnapshot = fragmentResult.snapshot;
    if (!renderedSnapshot) {
      return [false, null];
    }
    var storeEpoch = null;
    storeEpoch = environment.getStore().getEpoch();
    if (fragmentResult.storeEpoch === storeEpoch) {
      return [false, fragmentResult.snapshot];
    }
    var cacheKey = fragmentResult.cacheKey;
    if (Array.isArray(renderedSnapshot)) {
      var didMissUpdates = false;
      var currentSnapshots = [];
      renderedSnapshot.forEach(function (snapshot, idx) {
        var currentSnapshot = environment.lookup(snapshot.selector);
        var renderData = snapshot.data;
        var currentData = currentSnapshot.data;
        var updatedData = recycleNodesInto(renderData, currentData);
        if (updatedData !== renderData) {
          currentSnapshot = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, currentSnapshot), {}, {
            data: updatedData
          });
          didMissUpdates = true;
        }
        currentSnapshots[idx] = currentSnapshot;
      });
      if (didMissUpdates) {
        var result = getFragmentResult(cacheKey, currentSnapshots, storeEpoch);
        if (RelayFeatureFlags.ENABLE_RELAY_OPERATION_TRACKER_SUSPENSE && result.isMissingData) {
          this._cache.set(cacheKey, {
            kind: 'missing',
            result: result,
            snapshot: currentSnapshots
          });
        } else {
          this._cache.set(cacheKey, {
            kind: 'done',
            result: result
          });
        }
      }
      return [didMissUpdates, currentSnapshots];
    }
    var currentSnapshot = environment.lookup(renderedSnapshot.selector);
    var renderData = renderedSnapshot.data;
    var currentData = currentSnapshot.data;
    var updatedData = recycleNodesInto(renderData, currentData);
    var updatedCurrentSnapshot = {
      data: updatedData,
      isMissingData: currentSnapshot.isMissingData,
      missingClientEdges: currentSnapshot.missingClientEdges,
      missingLiveResolverFields: currentSnapshot.missingLiveResolverFields,
      seenRecords: currentSnapshot.seenRecords,
      selector: currentSnapshot.selector,
      missingRequiredFields: currentSnapshot.missingRequiredFields,
      relayResolverErrors: currentSnapshot.relayResolverErrors
    };
    if (updatedData !== renderData) {
      var _result = getFragmentResult(cacheKey, updatedCurrentSnapshot, storeEpoch);
      if (RelayFeatureFlags.ENABLE_RELAY_OPERATION_TRACKER_SUSPENSE && _result.isMissingData) {
        this._cache.set(cacheKey, {
          kind: 'missing',
          result: _result,
          snapshot: updatedCurrentSnapshot
        });
      } else {
        this._cache.set(cacheKey, {
          kind: 'done',
          result: _result
        });
      }
    }
    return [updatedData !== renderData, updatedCurrentSnapshot];
  };
  _proto2.checkMissedUpdatesSpec = function checkMissedUpdatesSpec(fragmentResults) {
    var _this7 = this;
    return Object.keys(fragmentResults).some(function (key) {
      return _this7.checkMissedUpdates(fragmentResults[key])[0];
    });
  };
  _proto2._getAndSavePromiseForFragmentRequestInFlight = function _getAndSavePromiseForFragmentRequestInFlight(cacheKey, fragmentNode, fragmentOwner, fragmentResult) {
    var _this8 = this;
    var pendingOperationsResult = getPendingOperationsForFragment(this._environment, fragmentNode, fragmentOwner);
    if (pendingOperationsResult == null) {
      return null;
    }
    var networkPromise = pendingOperationsResult.promise;
    var pendingOperations = pendingOperationsResult.pendingOperations;
    var promise = networkPromise.then(function () {
      _this8._cache["delete"](cacheKey);
    })["catch"](function (error) {
      _this8._cache["delete"](cacheKey);
    });
    promise.displayName = networkPromise.displayName;
    this._cache.set(cacheKey, {
      kind: 'pending',
      pendingOperations: pendingOperations,
      promise: promise,
      result: fragmentResult
    });
    return {
      promise: promise,
      pendingOperations: pendingOperations
    };
  };
  _proto2._updatePluralSnapshot = function _updatePluralSnapshot(cacheKey, baseSnapshots, latestSnapshot, idx, storeEpoch) {
    var _currentFragmentResul;
    var currentFragmentResult = this._cache.get(cacheKey);
    if (isPromise(currentFragmentResult)) {
      reportInvalidCachedData(latestSnapshot.selector.node.name);
      return;
    }
    var currentSnapshot = currentFragmentResult === null || currentFragmentResult === void 0 ? void 0 : (_currentFragmentResul = currentFragmentResult.result) === null || _currentFragmentResul === void 0 ? void 0 : _currentFragmentResul.snapshot;
    if (currentSnapshot && !Array.isArray(currentSnapshot)) {
      reportInvalidCachedData(latestSnapshot.selector.node.name);
      return;
    }
    var nextSnapshots = currentSnapshot ? (0, _toConsumableArray2["default"])(currentSnapshot) : (0, _toConsumableArray2["default"])(baseSnapshots);
    nextSnapshots[idx] = latestSnapshot;
    var result = getFragmentResult(cacheKey, nextSnapshots, storeEpoch);
    if (RelayFeatureFlags.ENABLE_RELAY_OPERATION_TRACKER_SUSPENSE && result.isMissingData) {
      this._cache.set(cacheKey, {
        kind: 'missing',
        result: result,
        snapshot: nextSnapshots
      });
    } else {
      this._cache.set(cacheKey, {
        kind: 'done',
        result: result
      });
    }
  };
  return FragmentResourceImpl;
}();
function reportInvalidCachedData(nodeName) {
  !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to find cached data for plural fragment `%s` when ' + 'receiving a subscription. ' + "If you're seeing this, this is likely a bug in Relay.", nodeName) : invariant(false) : void 0;
}
function createFragmentResource(environment) {
  return new FragmentResourceImpl(environment);
}
var dataResources = WEAKMAP_SUPPORTED ? new WeakMap() : new Map();
function getFragmentResourceForEnvironment(environment) {
  var cached = dataResources.get(environment);
  if (cached) {
    return cached;
  }
  var newDataResource = createFragmentResource(environment);
  dataResources.set(environment, newDataResource);
  return newDataResource;
}
module.exports = {
  createFragmentResource: createFragmentResource,
  getFragmentResourceForEnvironment: getFragmentResourceForEnvironment
};