'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _excluded = ["componentRef", "__relayContext", "__rootIsQueryRenderer"];
var buildReactRelayContainer = require('./buildReactRelayContainer');
var _require = require('./ReactRelayContainerUtils'),
  getContainerName = _require.getContainerName;
var _require2 = require('./RelayContext'),
  assertRelayContext = _require2.assertRelayContext;
var areEqual = require("fbjs/lib/areEqual");
var React = require('react');
var _require3 = require('relay-runtime'),
  createFragmentSpecResolver = _require3.createFragmentSpecResolver,
  getDataIDsFromObject = _require3.getDataIDsFromObject,
  isScalarAndEqual = _require3.isScalarAndEqual;
function createContainerWithFragments(Component, fragments) {
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
            data: updatedState.resolver.resolve(),
            relayProp: getRelayProp(updatedState.relayProp.environment)
          } : null;
        });
      });
      var relayContext = assertRelayContext(props.__relayContext);
      var rootIsQueryRenderer = (_props$__rootIsQueryR = props.__rootIsQueryRenderer) !== null && _props$__rootIsQueryR !== void 0 ? _props$__rootIsQueryR : false;
      var resolver = createFragmentSpecResolver(relayContext, containerName, fragments, props, rootIsQueryRenderer);
      _this.state = {
        data: resolver.resolve(),
        prevProps: props,
        prevPropsContext: relayContext,
        relayProp: getRelayProp(relayContext.environment),
        resolver: resolver
      };
      return _this;
    }
    _class.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
      var _nextProps$__rootIsQu;
      var prevProps = prevState.prevProps;
      var relayContext = assertRelayContext(nextProps.__relayContext);
      var rootIsQueryRenderer = (_nextProps$__rootIsQu = nextProps.__rootIsQueryRenderer) !== null && _nextProps$__rootIsQu !== void 0 ? _nextProps$__rootIsQu : false;
      var prevIDs = getDataIDsFromObject(fragments, prevProps);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);
      var resolver = prevState.resolver;
      if (prevState.prevPropsContext.environment !== relayContext.environment || !areEqual(prevIDs, nextIDs)) {
        resolver = createFragmentSpecResolver(relayContext, containerName, fragments, nextProps, rootIsQueryRenderer);
        return {
          data: resolver.resolve(),
          prevPropsContext: relayContext,
          prevProps: nextProps,
          relayProp: getRelayProp(relayContext.environment),
          resolver: resolver
        };
      } else {
        resolver.setProps(nextProps);
        var data = resolver.resolve();
        if (data !== prevState.data) {
          return {
            data: data,
            prevProps: nextProps,
            prevPropsContext: relayContext,
            relayProp: getRelayProp(relayContext.environment)
          };
        }
      }
      return null;
    };
    var _proto = _class.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this._subscribeToNewResolverAndRerenderIfStoreHasChanged();
    };
    _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      if (this.state.resolver !== prevState.resolver) {
        prevState.resolver.dispose();
        this._subscribeToNewResolverAndRerenderIfStoreHasChanged();
      } else {
        this._rerenderIfStoreHasChanged();
      }
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.state.resolver.dispose();
    };
    _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
      if (nextState.data !== this.state.data) {
        return true;
      }
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var key = keys[ii];
        if (key === '__relayContext') {
          if (nextState.prevPropsContext.environment !== this.state.prevPropsContext.environment) {
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
    _proto.render = function render() {
      var _this$props = this.props,
        componentRef = _this$props.componentRef,
        __relayContext = _this$props.__relayContext,
        __rootIsQueryRenderer = _this$props.__rootIsQueryRenderer,
        props = (0, _objectWithoutPropertiesLoose2["default"])(_this$props, _excluded);
      return /*#__PURE__*/React.createElement(Component, (0, _extends2["default"])({}, props, this.state.data, {
        ref: componentRef,
        relay: this.state.relayProp
      }));
    };
    return _class;
  }(React.Component), (0, _defineProperty2["default"])(_class, "displayName", containerName), _class;
}
function getRelayProp(environment) {
  return {
    environment: environment
  };
}
function createContainer(Component, fragmentSpec) {
  return buildReactRelayContainer(Component, fragmentSpec, createContainerWithFragments);
}
module.exports = {
  createContainer: createContainer
};