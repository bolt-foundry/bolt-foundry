'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var ReactRelayContext = require('./ReactRelayContext');
var ReactRelayQueryFetcher = require('./ReactRelayQueryFetcher');
var ReactRelayQueryRendererContext = require('./ReactRelayQueryRendererContext');
var areEqual = require("fbjs/lib/areEqual");
var React = require('react');
var _require = require('relay-runtime'),
  createOperationDescriptor = _require.createOperationDescriptor,
  deepFreeze = _require.deepFreeze,
  getRequest = _require.getRequest;
var requestCache = {};
var queryRendererContext = {
  rootIsQueryRenderer: true
};
var ReactRelayQueryRenderer = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2["default"])(ReactRelayQueryRenderer, _React$Component);
  function ReactRelayQueryRenderer(props) {
    var _this;
    _this = _React$Component.call(this, props) || this;
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_handleDataChange", function (params) {
      var error = params.error == null ? null : params.error;
      var snapshot = params.snapshot == null ? null : params.snapshot;
      _this.setState(function (prevState) {
        var prevRequestCacheKey = prevState.requestCacheKey;
        if (prevRequestCacheKey) {
          delete requestCache[prevRequestCacheKey];
        }
        if (snapshot === prevState.snapshot && error === prevState.error) {
          return null;
        }
        return {
          renderProps: getRenderProps(error, snapshot, prevState.queryFetcher, prevState.retryCallbacks),
          snapshot: snapshot,
          requestCacheKey: null
        };
      });
    });
    var retryCallbacks = {
      handleDataChange: null,
      handleRetryAfterError: null
    };
    var queryFetcher;
    var requestCacheKey;
    if (props.query) {
      var query = props.query;
      var request = getRequest(query);
      requestCacheKey = getRequestCacheKey(request.params, props.variables);
      queryFetcher = requestCache[requestCacheKey] ? requestCache[requestCacheKey].queryFetcher : new ReactRelayQueryFetcher();
    } else {
      queryFetcher = new ReactRelayQueryFetcher();
    }
    _this._maybeHiddenOrFastRefresh = false;
    _this.state = (0, _objectSpread2["default"])({
      prevPropsEnvironment: props.environment,
      prevPropsVariables: props.variables,
      prevQuery: props.query,
      queryFetcher: queryFetcher,
      retryCallbacks: retryCallbacks
    }, fetchQueryAndComputeStateFromProps(props, queryFetcher, retryCallbacks, requestCacheKey));
    return _this;
  }
  ReactRelayQueryRenderer.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.prevQuery !== nextProps.query || prevState.prevPropsEnvironment !== nextProps.environment || !areEqual(prevState.prevPropsVariables, nextProps.variables)) {
      return resetQueryStateForUpdate(nextProps, prevState);
    }
    return null;
  };
  var _proto = ReactRelayQueryRenderer.prototype;
  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;
    if (this._maybeHiddenOrFastRefresh === true) {
      this._maybeHiddenOrFastRefresh = false;
      this.setState(function (prevState) {
        var newState = resetQueryStateForUpdate(_this2.props, prevState);
        var requestCacheKey = newState.requestCacheKey,
          queryFetcher = newState.queryFetcher;
        if (requestCacheKey != null && requestCache[requestCacheKey] != null) {
          queryFetcher.setOnDataChange(_this2._handleDataChange);
        }
        return newState;
      });
      return;
    }
    var _this$state = this.state,
      retryCallbacks = _this$state.retryCallbacks,
      queryFetcher = _this$state.queryFetcher,
      requestCacheKey = _this$state.requestCacheKey;
    if (requestCacheKey) {
      delete requestCache[requestCacheKey];
    }
    retryCallbacks.handleDataChange = this._handleDataChange;
    retryCallbacks.handleRetryAfterError = function (error) {
      return _this2.setState(function (prevState) {
        var prevRequestCacheKey = prevState.requestCacheKey;
        if (prevRequestCacheKey) {
          delete requestCache[prevRequestCacheKey];
        }
        return {
          renderProps: getLoadingRenderProps(),
          requestCacheKey: null
        };
      });
    };
    if (this.props.query) {
      queryFetcher.setOnDataChange(this._handleDataChange);
    }
  };
  _proto.componentDidUpdate = function componentDidUpdate(_prevProps, prevState) {
    var _this$state2 = this.state,
      queryFetcher = _this$state2.queryFetcher,
      requestCacheKey = _this$state2.requestCacheKey;
    if (requestCacheKey) {
      delete requestCache[requestCacheKey];
      delete this.state.requestCacheKey;
    }
    if (this.props.query && queryFetcher !== prevState.queryFetcher) {
      queryFetcher.setOnDataChange(this._handleDataChange);
    }
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.state.queryFetcher.dispose();
    this._maybeHiddenOrFastRefresh = true;
  };
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return nextProps.render !== this.props.render || nextState.renderProps !== this.state.renderProps;
  };
  _proto.render = function render() {
    var _this$state3 = this.state,
      renderProps = _this$state3.renderProps,
      relayContext = _this$state3.relayContext;
    if (process.env.NODE_ENV !== "production") {
      deepFreeze(renderProps);
    }
    return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
      value: relayContext
    }, /*#__PURE__*/React.createElement(ReactRelayQueryRendererContext.Provider, {
      value: queryRendererContext
    }, this.props.render(renderProps)));
  };
  return ReactRelayQueryRenderer;
}(React.Component);
function getLoadingRenderProps() {
  return {
    error: null,
    props: null,
    retry: null
  };
}
function getEmptyRenderProps() {
  return {
    error: null,
    props: {},
    retry: null
  };
}
function getRenderProps(error, snapshot, queryFetcher, retryCallbacks) {
  return {
    error: error ? error : null,
    props: snapshot ? snapshot.data : null,
    retry: function retry(cacheConfigOverride) {
      var syncSnapshot = queryFetcher.retry(cacheConfigOverride);
      if (syncSnapshot && typeof retryCallbacks.handleDataChange === 'function') {
        retryCallbacks.handleDataChange({
          snapshot: syncSnapshot
        });
      } else if (error && typeof retryCallbacks.handleRetryAfterError === 'function') {
        retryCallbacks.handleRetryAfterError(error);
      }
    }
  };
}
function getRequestCacheKey(request, variables) {
  return JSON.stringify({
    id: request.cacheID ? request.cacheID : request.id,
    variables: variables
  });
}
function resetQueryStateForUpdate(props, prevState) {
  var query = props.query;
  var prevSelectionReferences = prevState.queryFetcher.getSelectionReferences();
  prevState.queryFetcher.disposeRequest();
  var queryFetcher;
  if (query) {
    var request = getRequest(query);
    var requestCacheKey = getRequestCacheKey(request.params, props.variables);
    queryFetcher = requestCache[requestCacheKey] ? requestCache[requestCacheKey].queryFetcher : new ReactRelayQueryFetcher(prevSelectionReferences);
  } else {
    queryFetcher = new ReactRelayQueryFetcher(prevSelectionReferences);
  }
  return (0, _objectSpread2["default"])({
    prevQuery: props.query,
    prevPropsEnvironment: props.environment,
    prevPropsVariables: props.variables,
    queryFetcher: queryFetcher
  }, fetchQueryAndComputeStateFromProps(props, queryFetcher, prevState.retryCallbacks));
}
function fetchQueryAndComputeStateFromProps(props, queryFetcher, retryCallbacks, requestCacheKey) {
  var environment = props.environment,
    query = props.query,
    variables = props.variables,
    cacheConfig = props.cacheConfig;
  var genericEnvironment = environment;
  if (query) {
    var request = getRequest(query);
    var operation = createOperationDescriptor(request, variables, cacheConfig);
    var relayContext = {
      environment: genericEnvironment
    };
    if (typeof requestCacheKey === 'string' && requestCache[requestCacheKey]) {
      var snapshot = requestCache[requestCacheKey].snapshot;
      if (snapshot) {
        return {
          error: null,
          relayContext: relayContext,
          renderProps: getRenderProps(null, snapshot, queryFetcher, retryCallbacks),
          snapshot: snapshot,
          requestCacheKey: requestCacheKey
        };
      } else {
        return {
          error: null,
          relayContext: relayContext,
          renderProps: getLoadingRenderProps(),
          snapshot: null,
          requestCacheKey: requestCacheKey
        };
      }
    }
    try {
      var storeSnapshot = queryFetcher.lookupInStore(genericEnvironment, operation, props.fetchPolicy);
      var querySnapshot = queryFetcher.fetch({
        environment: genericEnvironment,
        onDataChange: null,
        operation: operation
      });
      var _snapshot = querySnapshot || storeSnapshot;
      requestCacheKey = requestCacheKey || getRequestCacheKey(request.params, props.variables);
      requestCache[requestCacheKey] = {
        queryFetcher: queryFetcher,
        snapshot: _snapshot
      };
      if (!_snapshot) {
        return {
          error: null,
          relayContext: relayContext,
          renderProps: getLoadingRenderProps(),
          snapshot: null,
          requestCacheKey: requestCacheKey
        };
      }
      return {
        error: null,
        relayContext: relayContext,
        renderProps: getRenderProps(null, _snapshot, queryFetcher, retryCallbacks),
        snapshot: _snapshot,
        requestCacheKey: requestCacheKey
      };
    } catch (error) {
      return {
        error: error,
        relayContext: relayContext,
        renderProps: getRenderProps(error, null, queryFetcher, retryCallbacks),
        snapshot: null,
        requestCacheKey: requestCacheKey
      };
    }
  } else {
    queryFetcher.dispose();
    var _relayContext = {
      environment: genericEnvironment
    };
    return {
      error: null,
      relayContext: _relayContext,
      renderProps: getEmptyRenderProps(),
      requestCacheKey: null
    };
  }
}
module.exports = ReactRelayQueryRenderer;