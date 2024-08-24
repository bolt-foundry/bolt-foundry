'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _excluded = ["componentRef"],
  _excluded2 = ["componentRef", "__relayContext", "__rootIsQueryRenderer"],
  _excluded3 = ["componentRef", "__relayContext", "__rootIsQueryRenderer"];
var buildReactRelayContainer = require('./buildReactRelayContainer');
var getRootVariablesForFragments = require('./getRootVariablesForFragments');
var _require = require('./ReactRelayContainerUtils'),
  getComponentName = _require.getComponentName,
  getContainerName = _require.getContainerName;
var ReactRelayContext = require('./ReactRelayContext');
var ReactRelayQueryFetcher = require('./ReactRelayQueryFetcher');
var _require2 = require('./RelayContext'),
  assertRelayContext = _require2.assertRelayContext;
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
var React = require('react');
var _require3 = require('relay-runtime'),
  ConnectionInterface = _require3.ConnectionInterface,
  Observable = _require3.Observable,
  RelayFeatureFlags = _require3.RelayFeatureFlags,
  createFragmentSpecResolver = _require3.createFragmentSpecResolver,
  createOperationDescriptor = _require3.createOperationDescriptor,
  getDataIDsFromObject = _require3.getDataIDsFromObject,
  getRequest = _require3.getRequest,
  getVariablesFromObject = _require3.getVariablesFromObject,
  isScalarAndEqual = _require3.isScalarAndEqual;
var warning = require("fbjs/lib/warning");
var FORWARD = 'forward';
function createGetConnectionFromProps(metadata) {
  var path = metadata.path;
  !path ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getConnectionFromProps function.') : invariant(false) : void 0;
  return function (props) {
    var data = props[metadata.fragmentName];
    for (var i = 0; i < path.length; i++) {
      if (!data || typeof data !== 'object') {
        return null;
      }
      data = data[path[i]];
    }
    return data;
  };
}
function createGetFragmentVariables(metadata) {
  var countVariable = metadata.count;
  !countVariable ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getFragmentVariables function.') : invariant(false) : void 0;
  return function (prevVars, totalCount) {
    return (0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, prevVars), {}, (0, _defineProperty2["default"])({}, countVariable, totalCount));
  };
}
function findConnectionMetadata(fragments) {
  var foundConnectionMetadata = null;
  var isRelayModern = false;
  for (var fragmentName in fragments) {
    var fragment = fragments[fragmentName];
    var connectionMetadata = fragment.metadata && fragment.metadata.connection;
    if (fragment.metadata !== undefined) {
      isRelayModern = true;
    }
    if (connectionMetadata) {
      !(connectionMetadata.length === 1) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Only a single @connection is ' + 'supported, `%s` has %s.', fragmentName, connectionMetadata.length) : invariant(false) : void 0;
      !!foundConnectionMetadata ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Only a single fragment with ' + '@connection is supported.') : invariant(false) : void 0;
      foundConnectionMetadata = (0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, connectionMetadata[0]), {}, {
        fragmentName: fragmentName
      });
    }
  }
  !(!isRelayModern || foundConnectionMetadata !== null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: A @connection directive must be present.') : invariant(false) : void 0;
  return foundConnectionMetadata || {};
}
function toObserver(observerOrCallback) {
  return typeof observerOrCallback === 'function' ? {
    error: observerOrCallback,
    complete: observerOrCallback,
    unsubscribe: function unsubscribe(subscription) {
      typeof observerOrCallback === 'function' && observerOrCallback();
    }
  } : observerOrCallback || {};
}
function createContainerWithFragments(Component, fragments, connectionConfig) {
  var _class;
  var componentName = getComponentName(Component);
  var containerName = getContainerName(Component);
  var metadata = findConnectionMetadata(fragments);
  var getConnectionFromProps = connectionConfig.getConnectionFromProps || createGetConnectionFromProps(metadata);
  var direction = connectionConfig.direction || metadata.direction;
  !direction ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Unable to infer direction of the ' + 'connection, possibly because both first and last are provided.') : invariant(false) : void 0;
  var getFragmentVariables = connectionConfig.getFragmentVariables || createGetFragmentVariables(metadata);
  return _class = /*#__PURE__*/function (_React$Component) {
    (0, _inheritsLoose2["default"])(_class, _React$Component);
    function _class(props) {
      var _props$__rootIsQueryR, _this;
      _this = _React$Component.call(this, props) || this;
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleFragmentDataUpdate", function () {
        _this.setState({
          data: _this._resolver.resolve()
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_hasMore", function () {
        var connectionData = _this._getConnectionData();
        return !!(connectionData && connectionData.hasMore && connectionData.cursor);
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_isLoading", function () {
        return !!_this._refetchSubscription;
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_refetchConnection", function (totalCount, observerOrCallback, refetchVariables) {
        if (!_this._canFetchPage('refetchConnection')) {
          return {
            dispose: function dispose() {}
          };
        }
        _this._refetchVariables = refetchVariables;
        var paginatingVariables = {
          count: totalCount,
          cursor: null,
          totalCount: totalCount
        };
        var fetch = _this._fetchPage(paginatingVariables, toObserver(observerOrCallback), {
          force: true
        });
        return {
          dispose: fetch.unsubscribe
        };
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_loadMore", function (pageSize, observerOrCallback, options) {
        if (!_this._canFetchPage('loadMore')) {
          return {
            dispose: function dispose() {}
          };
        }
        var observer = toObserver(observerOrCallback);
        var connectionData = _this._getConnectionData();
        if (!connectionData) {
          Observable.create(function (sink) {
            return sink.complete();
          }).subscribe(observer);
          return null;
        }
        var totalCount = connectionData.edgeCount + pageSize;
        if (options && options.force) {
          return _this._refetchConnection(totalCount, observerOrCallback);
        }
        var _ConnectionInterface$ = ConnectionInterface.get(),
          END_CURSOR = _ConnectionInterface$.END_CURSOR,
          START_CURSOR = _ConnectionInterface$.START_CURSOR;
        var cursor = connectionData.cursor;
        process.env.NODE_ENV !== "production" ? warning(cursor != null && cursor !== '', 'ReactRelayPaginationContainer: Cannot `loadMore` without valid `%s` (got `%s`)', direction === FORWARD ? END_CURSOR : START_CURSOR, cursor) : void 0;
        var paginatingVariables = {
          count: pageSize,
          cursor: cursor,
          totalCount: totalCount
        };
        var fetch = _this._fetchPage(paginatingVariables, observer, options);
        return {
          dispose: fetch.unsubscribe
        };
      });
      var relayContext = assertRelayContext(props.__relayContext);
      var rootIsQueryRenderer = (_props$__rootIsQueryR = props.__rootIsQueryRenderer) !== null && _props$__rootIsQueryR !== void 0 ? _props$__rootIsQueryR : false;
      _this._isARequestInFlight = false;
      _this._refetchSubscription = null;
      _this._refetchVariables = null;
      if (RelayFeatureFlags.ENABLE_CONTAINERS_SUBSCRIBE_ON_COMMIT === true) {
        _this._resolver = createFragmentSpecResolver(relayContext, containerName, fragments, props, rootIsQueryRenderer);
      } else {
        _this._resolver = createFragmentSpecResolver(relayContext, containerName, fragments, props, rootIsQueryRenderer, _this._handleFragmentDataUpdate);
      }
      _this.state = {
        data: _this._resolver.resolve(),
        prevContext: relayContext,
        contextForChildren: relayContext,
        relayProp: _this._buildRelayProp(relayContext),
        resolverGeneration: 0
      };
      _this._isUnmounted = false;
      _this._hasFetched = false;
      return _this;
    }
    var _proto = _class.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this._isUnmounted = false;
      if (RelayFeatureFlags.ENABLE_CONTAINERS_SUBSCRIBE_ON_COMMIT === true) {
        this._subscribeToNewResolverAndRerenderIfStoreHasChanged();
      }
    };
    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (RelayFeatureFlags.ENABLE_CONTAINERS_SUBSCRIBE_ON_COMMIT === true) {
        if (prevState.resolverGeneration !== this.state.resolverGeneration) {
          this._subscribeToNewResolverAndRerenderIfStoreHasChanged();
        } else {
          this._rerenderIfStoreHasChanged();
        }
      }
    };
    _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this2 = this;
      var _nextProps$__rootIsQu;
      var relayContext = assertRelayContext(nextProps.__relayContext);
      var rootIsQueryRenderer = (_nextProps$__rootIsQu = nextProps.__rootIsQueryRenderer) !== null && _nextProps$__rootIsQu !== void 0 ? _nextProps$__rootIsQu : false;
      var prevIDs = getDataIDsFromObject(fragments, this.props);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);
      var prevRootVariables = getRootVariablesForFragments(fragments, this.props);
      var nextRootVariables = getRootVariablesForFragments(fragments, nextProps);
      if (relayContext.environment !== this.state.prevContext.environment || !areEqual(prevRootVariables, nextRootVariables) || !areEqual(prevIDs, nextIDs)) {
        this._cleanup();
        if (RelayFeatureFlags.ENABLE_CONTAINERS_SUBSCRIBE_ON_COMMIT === true) {
          this._resolver = createFragmentSpecResolver(relayContext, containerName, fragments, nextProps, rootIsQueryRenderer);
        } else {
          this._resolver = createFragmentSpecResolver(relayContext, containerName, fragments, nextProps, rootIsQueryRenderer, this._handleFragmentDataUpdate);
        }
        this.setState(function (prevState) {
          return {
            prevContext: relayContext,
            contextForChildren: relayContext,
            relayProp: _this2._buildRelayProp(relayContext),
            resolverGeneration: prevState.resolverGeneration + 1
          };
        });
      } else if (!this._hasFetched) {
        this._resolver.setProps(nextProps);
      }
      var data = this._resolver.resolve();
      if (data !== this.state.data) {
        this.setState({
          data: data
        });
      }
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this._isUnmounted = true;
      this._cleanup();
    };
    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      if (nextState.data !== this.state.data || nextState.relayProp !== this.state.relayProp || nextState.resolverGeneration !== this.state.resolverGeneration) {
        return true;
      }
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var key = keys[ii];
        if (key === '__relayContext') {
          if (nextState.prevContext.environment !== this.state.prevContext.environment) {
            return true;
          }
        } else {
          if (!fragments.hasOwnProperty(key) && !isScalarAndEqual(nextProps[key], this.props[key])) {
            return true;
          }
        }
      }
      return false;
    };
    _proto._buildRelayProp = function _buildRelayProp(relayContext) {
      return {
        hasMore: this._hasMore,
        isLoading: this._isLoading,
        loadMore: this._loadMore,
        refetchConnection: this._refetchConnection,
        environment: relayContext.environment
      };
    };
    _proto._rerenderIfStoreHasChanged = function _rerenderIfStoreHasChanged() {
      var data = this.state.data;
      var maybeNewData = this._resolver.resolve();
      if (data !== maybeNewData) {
        this.setState({
          data: maybeNewData
        });
      }
    };
    _proto._subscribeToNewResolverAndRerenderIfStoreHasChanged = function _subscribeToNewResolverAndRerenderIfStoreHasChanged() {
      var data = this.state.data;
      var maybeNewData = this._resolver.resolve();
      this._resolver.setCallback(this.props, this._handleFragmentDataUpdate);
      if (data !== maybeNewData) {
        this.setState({
          data: maybeNewData
        });
      }
    };
    _proto._getConnectionData = function _getConnectionData() {
      var _this$props = this.props,
        _ = _this$props.componentRef,
        restProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, _excluded);
      var props = (0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, restProps), this.state.data);
      var connectionData = getConnectionFromProps(props);
      if (connectionData == null) {
        return null;
      }
      var _ConnectionInterface$2 = ConnectionInterface.get(),
        EDGES = _ConnectionInterface$2.EDGES,
        PAGE_INFO = _ConnectionInterface$2.PAGE_INFO,
        HAS_NEXT_PAGE = _ConnectionInterface$2.HAS_NEXT_PAGE,
        HAS_PREV_PAGE = _ConnectionInterface$2.HAS_PREV_PAGE,
        END_CURSOR = _ConnectionInterface$2.END_CURSOR,
        START_CURSOR = _ConnectionInterface$2.START_CURSOR;
      !(typeof connectionData === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return `null` or a plain object with %s and %s properties, got `%s`.', componentName, EDGES, PAGE_INFO, connectionData) : invariant(false) : void 0;
      var edges = connectionData[EDGES];
      var pageInfo = connectionData[PAGE_INFO];
      if (edges == null || pageInfo == null) {
        return null;
      }
      !Array.isArray(edges) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Array, got `%s`.', componentName, EDGES, edges) : invariant(false) : void 0;
      !(typeof pageInfo === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Object, got `%s`.', componentName, PAGE_INFO, pageInfo) : invariant(false) : void 0;
      var hasMore = direction === FORWARD ? pageInfo[HAS_NEXT_PAGE] : pageInfo[HAS_PREV_PAGE];
      var cursor = direction === FORWARD ? pageInfo[END_CURSOR] : pageInfo[START_CURSOR];
      if (typeof hasMore !== 'boolean' || edges.length !== 0 && typeof cursor === 'undefined') {
        process.env.NODE_ENV !== "production" ? warning(false, 'ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. ' + 'Be sure to fetch %s (got `%s`) and %s (got `%s`).', PAGE_INFO, componentName, direction === FORWARD ? HAS_NEXT_PAGE : HAS_PREV_PAGE, hasMore, direction === FORWARD ? END_CURSOR : START_CURSOR, cursor) : void 0;
        return null;
      }
      return {
        cursor: cursor,
        edgeCount: edges.length,
        hasMore: hasMore
      };
    };
    _proto._getQueryFetcher = function _getQueryFetcher() {
      if (!this._queryFetcher) {
        this._queryFetcher = new ReactRelayQueryFetcher();
      }
      return this._queryFetcher;
    };
    _proto._canFetchPage = function _canFetchPage(method) {
      if (this._isUnmounted) {
        process.env.NODE_ENV !== "production" ? warning(false, 'ReactRelayPaginationContainer: Unexpected call of `%s` ' + 'on unmounted container `%s`. It looks like some instances ' + 'of your container still trying to fetch data but they already ' + 'unmounted. Please make sure you clear all timers, intervals, async ' + 'calls, etc that may trigger `%s` call.', method, containerName, method) : void 0;
        return false;
      }
      return true;
    };
    _proto._fetchPage = function _fetchPage(paginatingVariables, observer, options) {
      var _this3 = this;
      var _assertRelayContext = assertRelayContext(this.props.__relayContext),
        environment = _assertRelayContext.environment;
      var _this$props2 = this.props,
        _ = _this$props2.componentRef,
        __relayContext = _this$props2.__relayContext,
        __rootIsQueryRenderer = _this$props2.__rootIsQueryRenderer,
        restProps = (0, _objectWithoutPropertiesLoose2["default"])(_this$props2, _excluded2);
      var props = (0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, restProps), this.state.data);
      var fragmentVariables;
      var rootVariables = getRootVariablesForFragments(fragments, restProps);
      fragmentVariables = getVariablesFromObject(fragments, restProps);
      fragmentVariables = (0, _objectSpread3["default"])((0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, rootVariables), fragmentVariables), this._refetchVariables);
      var fetchVariables = connectionConfig.getVariables(props, {
        count: paginatingVariables.count,
        cursor: paginatingVariables.cursor
      }, fragmentVariables);
      !(typeof fetchVariables === 'object' && fetchVariables !== null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ReactRelayPaginationContainer: Expected `getVariables()` to ' + 'return an object, got `%s` in `%s`.', fetchVariables, componentName) : invariant(false) : void 0;
      fetchVariables = (0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, fetchVariables), this._refetchVariables);
      fragmentVariables = (0, _objectSpread3["default"])((0, _objectSpread3["default"])({}, fetchVariables), fragmentVariables);
      var cacheConfig = options ? {
        force: !!options.force
      } : undefined;
      if (cacheConfig != null && (options === null || options === void 0 ? void 0 : options.metadata) != null) {
        cacheConfig.metadata = options === null || options === void 0 ? void 0 : options.metadata;
      }
      var request = getRequest(connectionConfig.query);
      var operation = createOperationDescriptor(request, fetchVariables, cacheConfig);
      var refetchSubscription = null;
      if (this._refetchSubscription) {
        this._refetchSubscription.unsubscribe();
      }
      this._hasFetched = true;
      var onNext = function onNext(payload, complete) {
        var prevData = _this3._resolver.resolve();
        _this3._resolver.setVariables(getFragmentVariables(fragmentVariables, paginatingVariables.totalCount), operation.request.node);
        var nextData = _this3._resolver.resolve();
        if (!areEqual(prevData, nextData)) {
          _this3.setState({
            data: nextData,
            contextForChildren: {
              environment: _this3.props.__relayContext.environment
            }
          }, complete);
        } else {
          complete();
        }
      };
      var cleanup = function cleanup() {
        if (_this3._refetchSubscription === refetchSubscription) {
          _this3._refetchSubscription = null;
          _this3._isARequestInFlight = false;
        }
      };
      this._isARequestInFlight = true;
      refetchSubscription = this._getQueryFetcher().execute({
        environment: environment,
        operation: operation,
        preservePreviousReferences: true
      }).mergeMap(function (payload) {
        return Observable.create(function (sink) {
          onNext(payload, function () {
            sink.next();
            sink.complete();
          });
        });
      })["do"]({
        error: cleanup,
        complete: cleanup,
        unsubscribe: cleanup
      }).subscribe(observer || {});
      this._refetchSubscription = this._isARequestInFlight ? refetchSubscription : null;
      return refetchSubscription;
    };
    _proto._cleanup = function _cleanup() {
      this._resolver.dispose();
      this._refetchVariables = null;
      this._hasFetched = false;
      if (this._refetchSubscription) {
        this._refetchSubscription.unsubscribe();
        this._refetchSubscription = null;
        this._isARequestInFlight = false;
      }
      if (this._queryFetcher) {
        this._queryFetcher.dispose();
      }
    };
    _proto.render = function render() {
      var _this$props3 = this.props,
        componentRef = _this$props3.componentRef,
        __relayContext = _this$props3.__relayContext,
        __rootIsQueryRenderer = _this$props3.__rootIsQueryRenderer,
        props = (0, _objectWithoutPropertiesLoose2["default"])(_this$props3, _excluded3);
      return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
        value: this.state.contextForChildren
      }, /*#__PURE__*/React.createElement(Component, (0, _extends2["default"])({}, props, this.state.data, {
        ref: componentRef,
        relay: this.state.relayProp
      })));
    };
    return _class;
  }(React.Component), (0, _defineProperty2["default"])(_class, "displayName", containerName), _class;
}
function createContainer(Component, fragmentSpec, connectionConfig) {
  return buildReactRelayContainer(Component, fragmentSpec, function (ComponentClass, fragments) {
    return createContainerWithFragments(ComponentClass, fragments, connectionConfig);
  });
}
module.exports = {
  createContainer: createContainer
};