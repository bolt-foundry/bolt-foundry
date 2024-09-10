'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var getPendingOperationsForFragment = require('../util/getPendingOperationsForFragment');
var handlePotentialSnapshotErrors = require('../util/handlePotentialSnapshotErrors');
var isScalarAndEqual = require('../util/isScalarAndEqual');
var recycleNodesInto = require('../util/recycleNodesInto');
var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var _require = require('./RelayModernOperationDescriptor'),
  createRequestDescriptor = _require.createRequestDescriptor;
var _require2 = require('./RelayModernSelector'),
  areEqualSelectors = _require2.areEqualSelectors,
  createReaderSelector = _require2.createReaderSelector,
  getSelectorsFromObject = _require2.getSelectorsFromObject;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
var RelayModernFragmentSpecResolver = /*#__PURE__*/function () {
  function RelayModernFragmentSpecResolver(context, fragments, props, callback, rootIsQueryRenderer) {
    var _this = this;
    (0, _defineProperty2["default"])(this, "_onChange", function () {
      _this._stale = true;
      if (typeof _this._callback === 'function') {
        _this._callback();
      }
    });
    this._callback = callback;
    this._context = context;
    this._data = {};
    this._fragments = fragments;
    this._props = {};
    this._resolvers = {};
    this._stale = false;
    this._rootIsQueryRenderer = rootIsQueryRenderer;
    this.setProps(props);
  }
  var _proto = RelayModernFragmentSpecResolver.prototype;
  _proto.dispose = function dispose() {
    for (var key in this._resolvers) {
      if (this._resolvers.hasOwnProperty(key)) {
        disposeCallback(this._resolvers[key]);
      }
    }
  };
  _proto.resolve = function resolve() {
    if (this._stale) {
      var prevData = this._data;
      var nextData;
      for (var key in this._resolvers) {
        if (this._resolvers.hasOwnProperty(key)) {
          var resolver = this._resolvers[key];
          var prevItem = prevData[key];
          if (resolver) {
            var nextItem = resolver.resolve();
            if (nextData || nextItem !== prevItem) {
              nextData = nextData || (0, _objectSpread2["default"])({}, prevData);
              nextData[key] = nextItem;
            }
          } else {
            var prop = this._props[key];
            var _nextItem = prop !== undefined ? prop : null;
            if (nextData || !isScalarAndEqual(_nextItem, prevItem)) {
              nextData = nextData || (0, _objectSpread2["default"])({}, prevData);
              nextData[key] = _nextItem;
            }
          }
        }
      }
      this._data = nextData || prevData;
      this._stale = false;
    }
    return this._data;
  };
  _proto.setCallback = function setCallback(props, callback) {
    this._callback = callback;
    if (RelayFeatureFlags.ENABLE_CONTAINERS_SUBSCRIBE_ON_COMMIT === true) {
      this.setProps(props);
    }
  };
  _proto.setProps = function setProps(props) {
    this._props = {};
    var ownedSelectors = getSelectorsFromObject(this._fragments, props);
    for (var key in ownedSelectors) {
      if (ownedSelectors.hasOwnProperty(key)) {
        var ownedSelector = ownedSelectors[key];
        var resolver = this._resolvers[key];
        if (ownedSelector == null) {
          if (resolver != null) {
            resolver.dispose();
          }
          resolver = null;
        } else if (ownedSelector.kind === 'PluralReaderSelector') {
          if (resolver == null) {
            resolver = new SelectorListResolver(this._context.environment, this._rootIsQueryRenderer, ownedSelector, this._callback != null, this._onChange);
          } else {
            !(resolver instanceof SelectorListResolver) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernFragmentSpecResolver: Expected prop `%s` to always be an array.', key) : invariant(false) : void 0;
            resolver.setSelector(ownedSelector);
          }
        } else {
          if (resolver == null) {
            resolver = new SelectorResolver(this._context.environment, this._rootIsQueryRenderer, ownedSelector, this._callback != null, this._onChange);
          } else {
            !(resolver instanceof SelectorResolver) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernFragmentSpecResolver: Expected prop `%s` to always be an object.', key) : invariant(false) : void 0;
            resolver.setSelector(ownedSelector);
          }
        }
        this._props[key] = props[key];
        this._resolvers[key] = resolver;
      }
    }
    this._stale = true;
  };
  _proto.setVariables = function setVariables(variables, request) {
    for (var key in this._resolvers) {
      if (this._resolvers.hasOwnProperty(key)) {
        var resolver = this._resolvers[key];
        if (resolver) {
          resolver.setVariables(variables, request);
        }
      }
    }
    this._stale = true;
  };
  return RelayModernFragmentSpecResolver;
}();
var SelectorResolver = /*#__PURE__*/function () {
  function SelectorResolver(environment, rootIsQueryRenderer, selector, subscribeOnConstruction, callback) {
    var _this2 = this;
    (0, _defineProperty2["default"])(this, "_onChange", function (snapshot) {
      _this2._data = snapshot.data;
      _this2._isMissingData = snapshot.isMissingData;
      _this2._missingRequiredFields = snapshot.missingRequiredFields;
      _this2._errorResponseFields = snapshot.errorResponseFields;
      _this2._relayResolverErrors = snapshot.relayResolverErrors;
      _this2._callback();
    });
    var _snapshot = environment.lookup(selector);
    this._callback = callback;
    this._data = _snapshot.data;
    this._isMissingData = _snapshot.isMissingData;
    this._missingRequiredFields = _snapshot.missingRequiredFields;
    this._errorResponseFields = _snapshot.errorResponseFields;
    this._relayResolverErrors = _snapshot.relayResolverErrors;
    this._environment = environment;
    this._rootIsQueryRenderer = rootIsQueryRenderer;
    this._selector = selector;
    if (RelayFeatureFlags.ENABLE_CONTAINERS_SUBSCRIBE_ON_COMMIT === true) {
      if (subscribeOnConstruction) {
        this._subscription = environment.subscribe(_snapshot, this._onChange);
      }
    } else {
      this._subscription = environment.subscribe(_snapshot, this._onChange);
    }
  }
  var _proto2 = SelectorResolver.prototype;
  _proto2.dispose = function dispose() {
    if (this._subscription) {
      this._subscription.dispose();
      this._subscription = null;
    }
  };
  _proto2.resolve = function resolve() {
    var _this$_selector$node$, _this$_selector$node$2;
    if (this._isMissingData === true) {
      var pendingOperationsResult = getPendingOperationsForFragment(this._environment, this._selector.node, this._selector.owner);
      var promise = pendingOperationsResult === null || pendingOperationsResult === void 0 ? void 0 : pendingOperationsResult.promise;
      if (promise != null) {
        if (this._rootIsQueryRenderer) {
          process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Relay Container for fragment `%s` has missing data and ' + 'would suspend. When using features such as @defer or @module, ' + 'use `useFragment` instead of a Relay Container.', this._selector.node.name) : void 0;
        } else {
          var _pendingOperationsRes;
          var pendingOperations = (_pendingOperationsRes = pendingOperationsResult === null || pendingOperationsResult === void 0 ? void 0 : pendingOperationsResult.pendingOperations) !== null && _pendingOperationsRes !== void 0 ? _pendingOperationsRes : [];
          process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Relay Container for fragment `%s` suspended. When using ' + 'features such as @defer or @module, use `useFragment` instead ' + 'of a Relay Container.', this._selector.node.name) : void 0;
          this._environment.__log({
            name: 'suspense.fragment',
            data: this._data,
            fragment: this._selector.node,
            isRelayHooks: false,
            isMissingData: this._isMissingData,
            isPromiseCached: false,
            pendingOperations: pendingOperations
          });
          throw promise;
        }
      }
    }
    handlePotentialSnapshotErrors(this._environment, this._missingRequiredFields, this._relayResolverErrors, this._errorResponseFields, (_this$_selector$node$ = (_this$_selector$node$2 = this._selector.node.metadata) === null || _this$_selector$node$2 === void 0 ? void 0 : _this$_selector$node$2.throwOnFieldError) !== null && _this$_selector$node$ !== void 0 ? _this$_selector$node$ : false);
    return this._data;
  };
  _proto2.setSelector = function setSelector(selector) {
    if (this._subscription != null && areEqualSelectors(selector, this._selector)) {
      return;
    }
    this.dispose();
    var snapshot = this._environment.lookup(selector);
    this._data = recycleNodesInto(this._data, snapshot.data);
    this._isMissingData = snapshot.isMissingData;
    this._missingRequiredFields = snapshot.missingRequiredFields;
    this._errorResponseFields = snapshot.errorResponseFields;
    this._relayResolverErrors = snapshot.relayResolverErrors;
    this._selector = selector;
    this._subscription = this._environment.subscribe(snapshot, this._onChange);
  };
  _proto2.setVariables = function setVariables(variables, request) {
    if (areEqual(variables, this._selector.variables)) {
      return;
    }
    var requestDescriptor = createRequestDescriptor(request, variables);
    var selector = createReaderSelector(this._selector.node, this._selector.dataID, variables, requestDescriptor);
    this.setSelector(selector);
  };
  return SelectorResolver;
}();
var SelectorListResolver = /*#__PURE__*/function () {
  function SelectorListResolver(environment, rootIsQueryRenderer, selector, subscribeOnConstruction, callback) {
    var _this3 = this;
    (0, _defineProperty2["default"])(this, "_onChange", function (data) {
      _this3._stale = true;
      _this3._callback();
    });
    this._callback = callback;
    this._data = [];
    this._environment = environment;
    this._resolvers = [];
    this._stale = true;
    this._rootIsQueryRenderer = rootIsQueryRenderer;
    this._subscribeOnConstruction = subscribeOnConstruction;
    this.setSelector(selector);
  }
  var _proto3 = SelectorListResolver.prototype;
  _proto3.dispose = function dispose() {
    this._resolvers.forEach(disposeCallback);
  };
  _proto3.resolve = function resolve() {
    if (this._stale) {
      var prevData = this._data;
      var nextData;
      for (var ii = 0; ii < this._resolvers.length; ii++) {
        var prevItem = prevData[ii];
        var nextItem = this._resolvers[ii].resolve();
        if (nextData || nextItem !== prevItem) {
          nextData = nextData || prevData.slice(0, ii);
          nextData.push(nextItem);
        }
      }
      if (!nextData && this._resolvers.length !== prevData.length) {
        nextData = prevData.slice(0, this._resolvers.length);
      }
      this._data = nextData || prevData;
      this._stale = false;
    }
    return this._data;
  };
  _proto3.setSelector = function setSelector(selector) {
    var selectors = selector.selectors;
    while (this._resolvers.length > selectors.length) {
      var resolver = this._resolvers.pop();
      resolver.dispose();
    }
    for (var ii = 0; ii < selectors.length; ii++) {
      if (ii < this._resolvers.length) {
        this._resolvers[ii].setSelector(selectors[ii]);
      } else {
        this._resolvers[ii] = new SelectorResolver(this._environment, this._rootIsQueryRenderer, selectors[ii], this._subscribeOnConstruction, this._onChange);
      }
    }
    this._stale = true;
  };
  _proto3.setVariables = function setVariables(variables, request) {
    this._resolvers.forEach(function (resolver) {
      return resolver.setVariables(variables, request);
    });
    this._stale = true;
  };
  return SelectorListResolver;
}();
function disposeCallback(disposable) {
  disposable && disposable.dispose();
}
module.exports = RelayModernFragmentSpecResolver;