'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var invariant = require('invariant');
var _require = require('relay-runtime'),
  fetchQuery = _require.__internal.fetchQuery,
  createOperationDescriptor = _require.createOperationDescriptor,
  isRelayModernEnvironment = _require.isRelayModernEnvironment;
var ReactRelayQueryFetcher = /*#__PURE__*/function () {
  function ReactRelayQueryFetcher(args) {
    (0, _defineProperty2["default"])(this, "_selectionReferences", []);
    (0, _defineProperty2["default"])(this, "_didFetchFinish", false);
    if (args != null) {
      this._cacheSelectionReference = args.cacheSelectionReference;
      this._selectionReferences = args.selectionReferences;
    }
  }
  var _proto = ReactRelayQueryFetcher.prototype;
  _proto.getSelectionReferences = function getSelectionReferences() {
    return {
      cacheSelectionReference: this._cacheSelectionReference,
      selectionReferences: this._selectionReferences
    };
  };
  _proto.lookupInStore = function lookupInStore(environment, operation, fetchPolicy) {
    if (fetchPolicy === 'store-and-network' || fetchPolicy === 'store-or-network') {
      if (environment.check(operation).status === 'available') {
        this._retainCachedOperation(environment, operation);
        return environment.lookup(operation.fragment);
      }
    }
    return null;
  };
  _proto.getFetchResult = function getFetchResult() {
    if (this._didFetchFinish) {
      if (this._error != null) {
        return {
          error: this._error
        };
      } else if (this._snapshot != null) {
        return {
          snapshot: this._snapshot
        };
      }
    } else {
      return null;
    }
  };
  _proto.execute = function execute(_ref) {
    var _this = this;
    var environment = _ref.environment,
      operation = _ref.operation,
      _ref$preservePrevious = _ref.preservePreviousReferences,
      preservePreviousReferences = _ref$preservePrevious === void 0 ? false : _ref$preservePrevious;
    var reference = environment.retain(operation);
    var error = function error() {
      _this._selectionReferences = _this._selectionReferences.concat(reference);
    };
    var complete = function complete() {
      if (!preservePreviousReferences) {
        _this.disposeSelectionReferences();
      }
      _this._selectionReferences = _this._selectionReferences.concat(reference);
    };
    var unsubscribe = function unsubscribe() {
      _this._selectionReferences = _this._selectionReferences.concat(reference);
    };
    if (!isRelayModernEnvironment(environment)) {
      return environment.execute({
        operation: operation
      })["do"]({
        error: error,
        complete: complete,
        unsubscribe: unsubscribe
      });
    }
    return fetchQuery(environment, operation)["do"]({
      error: error,
      complete: complete,
      unsubscribe: unsubscribe
    });
  };
  _proto.setOnDataChange = function setOnDataChange(onDataChange) {
    !this._fetchOptions ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayQueryFetcher: `setOnDataChange` should have been called after having called `fetch`') : invariant(false) : void 0;
    if (typeof onDataChange === 'function') {
      this._fetchOptions.onDataChangeCallbacks = this._fetchOptions.onDataChangeCallbacks || [];
      this._fetchOptions.onDataChangeCallbacks.push(onDataChange);
      if (this._didFetchFinish) {
        if (this._error != null) {
          onDataChange({
            error: this._error
          });
        } else if (this._snapshot != null) {
          onDataChange({
            snapshot: this._snapshot
          });
        }
      }
    }
  };
  _proto.fetch = function fetch(fetchOptions, cacheConfigOverride) {
    var _this2 = this;
    var environment = fetchOptions.environment,
      operation = fetchOptions.operation,
      onDataChange = fetchOptions.onDataChange;
    var fetchHasReturned = false;
    var _error;
    this.disposeRequest();
    var oldOnDataChangeCallbacks = this._fetchOptions && this._fetchOptions.onDataChangeCallbacks;
    this._fetchOptions = {
      environment: environment,
      onDataChangeCallbacks: oldOnDataChangeCallbacks || [],
      operation: operation
    };
    if (onDataChange && this._fetchOptions.onDataChangeCallbacks.indexOf(onDataChange) === -1) {
      this._fetchOptions.onDataChangeCallbacks.push(onDataChange);
    }
    var operationOverride = cacheConfigOverride ? createOperationDescriptor(operation.request.node, operation.request.variables, cacheConfigOverride) : operation;
    var request = this.execute({
      environment: environment,
      operation: operationOverride
    })["finally"](function () {
      _this2._pendingRequest = null;
    }).subscribe({
      next: function next() {
        _this2._didFetchFinish = true;
        _this2._error = null;
        _this2._onQueryDataAvailable({
          notifyFirstResult: fetchHasReturned
        });
      },
      error: function error(err) {
        _this2._didFetchFinish = true;
        _this2._error = err;
        _this2._snapshot = null;
        var onDataChangeCallbacks = _this2._fetchOptions && _this2._fetchOptions.onDataChangeCallbacks;
        if (fetchHasReturned) {
          if (onDataChangeCallbacks) {
            onDataChangeCallbacks.forEach(function (onDataChange) {
              onDataChange({
                error: err
              });
            });
          }
        } else {
          _error = err;
        }
      }
    });
    this._pendingRequest = {
      dispose: function dispose() {
        request.unsubscribe();
      }
    };
    fetchHasReturned = true;
    if (_error) {
      throw _error;
    }
    return this._snapshot;
  };
  _proto.retry = function retry(cacheConfigOverride) {
    !this._fetchOptions ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayQueryFetcher: `retry` should be called after having called `fetch`') : invariant(false) : void 0;
    return this.fetch({
      environment: this._fetchOptions.environment,
      operation: this._fetchOptions.operation,
      onDataChange: null
    }, cacheConfigOverride);
  };
  _proto.dispose = function dispose() {
    this.disposeRequest();
    this.disposeSelectionReferences();
  };
  _proto.disposeRequest = function disposeRequest() {
    this._error = null;
    this._snapshot = null;
    if (this._pendingRequest) {
      this._pendingRequest.dispose();
    }
    if (this._rootSubscription) {
      this._rootSubscription.dispose();
      this._rootSubscription = null;
    }
  };
  _proto._retainCachedOperation = function _retainCachedOperation(environment, operation) {
    this._disposeCacheSelectionReference();
    this._cacheSelectionReference = environment.retain(operation);
  };
  _proto._disposeCacheSelectionReference = function _disposeCacheSelectionReference() {
    this._cacheSelectionReference && this._cacheSelectionReference.dispose();
    this._cacheSelectionReference = null;
  };
  _proto.disposeSelectionReferences = function disposeSelectionReferences() {
    this._disposeCacheSelectionReference();
    this._selectionReferences.forEach(function (r) {
      return r.dispose();
    });
    this._selectionReferences = [];
  };
  _proto._onQueryDataAvailable = function _onQueryDataAvailable(_ref2) {
    var _this3 = this;
    var notifyFirstResult = _ref2.notifyFirstResult;
    !this._fetchOptions ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayQueryFetcher: `_onQueryDataAvailable` should have been called after having called `fetch`') : invariant(false) : void 0;
    var _this$_fetchOptions = this._fetchOptions,
      environment = _this$_fetchOptions.environment,
      onDataChangeCallbacks = _this$_fetchOptions.onDataChangeCallbacks,
      operation = _this$_fetchOptions.operation;
    if (this._snapshot) {
      return;
    }
    this._snapshot = environment.lookup(operation.fragment);
    this._rootSubscription = environment.subscribe(this._snapshot, function (snapshot) {
      if (_this3._fetchOptions != null) {
        var maybeNewOnDataChangeCallbacks = _this3._fetchOptions.onDataChangeCallbacks;
        if (Array.isArray(maybeNewOnDataChangeCallbacks)) {
          maybeNewOnDataChangeCallbacks.forEach(function (onDataChange) {
            return onDataChange({
              snapshot: snapshot
            });
          });
        }
      }
    });
    if (this._snapshot && notifyFirstResult && Array.isArray(onDataChangeCallbacks)) {
      var snapshot = this._snapshot;
      onDataChangeCallbacks.forEach(function (onDataChange) {
        return onDataChange({
          snapshot: snapshot
        });
      });
    }
  };
  return ReactRelayQueryFetcher;
}();
module.exports = ReactRelayQueryFetcher;