'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _excluded = ["componentRef", "__relayContext", "__rootIsQueryRenderer"];
var buildReactRelayContainer = require('./buildReactRelayContainer');
var getRootVariablesForFragments = require('./getRootVariablesForFragments');
var _require = require('./ReactRelayContainerUtils'),
  getContainerName = _require.getContainerName;
var ReactRelayContext = require('./ReactRelayContext');
var ReactRelayQueryFetcher = require('./ReactRelayQueryFetcher');
var _require2 = require('./RelayContext'),
  assertRelayContext = _require2.assertRelayContext;
var areEqual = require("fbjs/lib/areEqual");
var React = require('react');
var _require3 = require('relay-runtime'),
  Observable = _require3.Observable,
  createFragmentSpecResolver = _require3.createFragmentSpecResolver,
  createOperationDescriptor = _require3.createOperationDescriptor,
  getDataIDsFromObject = _require3.getDataIDsFromObject,
  getRequest = _require3.getRequest,
  getVariablesFromObject = _require3.getVariablesFromObject,
  isScalarAndEqual = _require3.isScalarAndEqual;
var warning = require("fbjs/lib/warning");
function createContainerWithFragments(Component, fragments, taggedNode) {
  var _class;
  var containerName = getContainerName(Component);
  return _class = /*#__PURE__*/function (_React$Component) {
    (0, _inheritsLoose2["default"])(_class, _React$Component);
    function _class(props) {
      var _props$__rootIsQueryR, _this;
      _this = _React$Component.call(this, props) || this;
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleFragmentDataUpdate", function () {
        var resolverFromThisUpdate = _this.state.resolver;
        _this.setState(function (updatedState) {
          return resolverFromThisUpdate === updatedState.resolver ? {
            data: updatedState.resolver.resolve()
          } : null;
        });
      });
      (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_refetch", function (refetchVariables, renderVariables, observerOrCallback, options) {
        if (_this._isUnmounted) {
          process.env.NODE_ENV !== "production" ? warning(false, 'ReactRelayRefetchContainer: Unexpected call of `refetch` ' + 'on unmounted container `%s`. It looks like some instances ' + 'of your container still trying to refetch the data but they already ' + 'unmounted. Please make sure you clear all timers, intervals, async ' + 'calls, etc that may trigger `refetch`.', containerName) : void 0;
          return {
            dispose: function dispose() {}
          };
        }
        var _assertRelayContext = assertRelayContext(_this.props.__relayContext),
          environment = _assertRelayContext.environment;
        var rootVariables = getRootVariablesForFragments(fragments, _this.props);
        var fetchVariables = typeof refetchVariables === 'function' ? refetchVariables(_this._getFragmentVariables()) : refetchVariables;
        fetchVariables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, rootVariables), fetchVariables);
        var fragmentVariables = renderVariables ? (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, fetchVariables), renderVariables) : fetchVariables;
        var cacheConfig = options ? {
          force: !!options.force
        } : undefined;
        if (cacheConfig != null && (options === null || options === void 0 ? void 0 : options.metadata) != null) {
          cacheConfig.metadata = options === null || options === void 0 ? void 0 : options.metadata;
        }
        var observer = typeof observerOrCallback === 'function' ? {
          next: observerOrCallback,
          error: observerOrCallback
        } : observerOrCallback || {};
        var query = getRequest(taggedNode);
        var operation = createOperationDescriptor(query, fetchVariables, cacheConfig);
        _this.state.localVariables = fetchVariables;
        _this._refetchSubscription && _this._refetchSubscription.unsubscribe();
        var refetchSubscription;
        var storeSnapshot = _this._getQueryFetcher().lookupInStore(environment, operation, options === null || options === void 0 ? void 0 : options.fetchPolicy);
        if (storeSnapshot != null) {
          _this.state.resolver.setVariables(fragmentVariables, operation.request.node);
          _this.setState(function (latestState) {
            return {
              data: latestState.resolver.resolve(),
              contextForChildren: {
                environment: _this.props.__relayContext.environment
              }
            };
          }, function () {
            observer.next && observer.next();
            observer.complete && observer.complete();
          });
          return {
            dispose: function dispose() {}
          };
        }
        _this._getQueryFetcher().execute({
          environment: environment,
          operation: operation,
          preservePreviousReferences: true
        }).mergeMap(function (response) {
          _this.state.resolver.setVariables(fragmentVariables, operation.request.node);
          return Observable.create(function (sink) {
            return _this.setState(function (latestState) {
              return {
                data: latestState.resolver.resolve(),
                contextForChildren: {
                  environment: _this.props.__relayContext.environment
                }
              };
            }, function () {
              sink.next();
              sink.complete();
            });
          });
        })["finally"](function () {
          if (_this._refetchSubscription === refetchSubscription) {
            _this._refetchSubscription = null;
          }
        }).subscribe((0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, observer), {}, {
          start: function start(subscription) {
            _this._refetchSubscription = refetchSubscription = subscription;
            observer.start && observer.start(subscription);
          }
        }));
        return {
          dispose: function dispose() {
            refetchSubscription && refetchSubscription.unsubscribe();
          }
        };
      });
      var relayContext = assertRelayContext(props.__relayContext);
      var rootIsQueryRenderer = (_props$__rootIsQueryR = props.__rootIsQueryRenderer) !== null && _props$__rootIsQueryR !== void 0 ? _props$__rootIsQueryR : false;
      _this._refetchSubscription = null;
      var resolver = createFragmentSpecResolver(relayContext, containerName, fragments, props, rootIsQueryRenderer);
      _this.state = {
        data: resolver.resolve(),
        localVariables: null,
        prevProps: props,
        prevPropsContext: relayContext,
        contextForChildren: relayContext,
        relayProp: getRelayProp(relayContext.environment, _this._refetch),
        resolver: resolver
      };
      _this._isUnmounted = false;
      return _this;
    }
    var _proto = _class.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this._isUnmounted = false;
      this._subscribeToNewResolverAndRerenderIfStoreHasChanged();
    };
    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (this.state.resolver !== prevState.resolver) {
        prevState.resolver.dispose();
        this._queryFetcher && this._queryFetcher.dispose();
        this._refetchSubscription && this._refetchSubscription.unsubscribe();
        this._subscribeToNewResolverAndRerenderIfStoreHasChanged();
      } else {
        this._rerenderIfStoreHasChanged();
      }
    };
    _class.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      var _nextProps$__rootIsQu;
      var prevProps = prevState.prevProps;
      var relayContext = assertRelayContext(nextProps.__relayContext);
      var rootIsQueryRenderer = (_nextProps$__rootIsQu = nextProps.__rootIsQueryRenderer) !== null && _nextProps$__rootIsQu !== void 0 ? _nextProps$__rootIsQu : false;
      var prevIDs = getDataIDsFromObject(fragments, prevProps);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);
      var prevRootVariables = getRootVariablesForFragments(fragments, prevProps);
      var nextRootVariables = getRootVariablesForFragments(fragments, nextProps);
      var resolver = prevState.resolver;
      if (prevState.prevPropsContext.environment !== relayContext.environment || !areEqual(prevRootVariables, nextRootVariables) || !areEqual(prevIDs, nextIDs)) {
        resolver = createFragmentSpecResolver(relayContext, containerName, fragments, nextProps, rootIsQueryRenderer);
        return {
          data: resolver.resolve(),
          localVariables: null,
          prevProps: nextProps,
          prevPropsContext: relayContext,
          contextForChildren: relayContext,
          relayProp: getRelayProp(relayContext.environment, prevState.relayProp.refetch),
          resolver: resolver
        };
      } else if (!prevState.localVariables) {
        resolver.setProps(nextProps);
      }
      var data = resolver.resolve();
      if (data !== prevState.data) {
        return {
          data: data,
          prevProps: nextProps
        };
      }
      return null;
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this._isUnmounted = true;
      this.state.resolver.dispose();
      this._queryFetcher && this._queryFetcher.dispose();
      this._refetchSubscription && this._refetchSubscription.unsubscribe();
    };
    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      if (nextState.data !== this.state.data || nextState.relayProp !== this.state.relayProp) {
        return true;
      }
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var key = keys[ii];
        if (key === '__relayContext') {
          if (this.state.prevPropsContext.environment !== nextState.prevPropsContext.environment) {
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
    _proto._rerenderIfStoreHasChanged = function _rerenderIfStoreHasChanged() {
      var _this$state = this.state,
        data = _this$state.data,
        resolver = _this$state.resolver;
      var maybeNewData = resolver.resolve();
      if (data !== maybeNewData) {
        this.setState({
          data: maybeNewData
        });
      }
    };
    _proto._subscribeToNewResolverAndRerenderIfStoreHasChanged = function _subscribeToNewResolverAndRerenderIfStoreHasChanged() {
      var _this$state2 = this.state,
        data = _this$state2.data,
        resolver = _this$state2.resolver;
      var maybeNewData = resolver.resolve();
      resolver.setCallback(this.props, this._handleFragmentDataUpdate);
      if (data !== maybeNewData) {
        this.setState({
          data: maybeNewData
        });
      }
    };
    _proto._getFragmentVariables = function _getFragmentVariables() {
      return getVariablesFromObject(fragments, this.props);
    };
    _proto._getQueryFetcher = function _getQueryFetcher() {
      if (!this._queryFetcher) {
        this._queryFetcher = new ReactRelayQueryFetcher();
      }
      return this._queryFetcher;
    };
    _proto.render = function render() {
      var _this$props = this.props,
        componentRef = _this$props.componentRef,
        __relayContext = _this$props.__relayContext,
        __rootIsQueryRenderer = _this$props.__rootIsQueryRenderer,
        props = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, _excluded);
      var _this$state3 = this.state,
        relayProp = _this$state3.relayProp,
        contextForChildren = _this$state3.contextForChildren;
      return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
        value: contextForChildren
      }, /*#__PURE__*/React.createElement(Component, (0, _extends2["default"])({}, props, this.state.data, {
        ref: componentRef,
        relay: relayProp
      })));
    };
    return _class;
  }(React.Component), (0, _defineProperty2["default"])(_class, "displayName", containerName), _class;
}
function getRelayProp(environment, refetch) {
  return {
    environment: environment,
    refetch: refetch
  };
}
function createContainer(Component, fragmentSpec, taggedNode) {
  return buildReactRelayContainer(Component, fragmentSpec, function (ComponentClass, fragments) {
    return createContainerWithFragments(ComponentClass, fragments, taggedNode);
  });
}
module.exports = {
  createContainer: createContainer
};