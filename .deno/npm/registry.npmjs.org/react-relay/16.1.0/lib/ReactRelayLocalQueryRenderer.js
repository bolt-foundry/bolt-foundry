'use strict';

var ReactRelayContext = require('./ReactRelayContext');
var ReactRelayQueryRendererContext = require('./ReactRelayQueryRendererContext');
var areEqual = require("fbjs/lib/areEqual");
var React = require('react');
var _require = require('relay-runtime'),
  createOperationDescriptor = _require.createOperationDescriptor,
  deepFreeze = _require.deepFreeze,
  getRequest = _require.getRequest;
var useLayoutEffect = React.useLayoutEffect,
  useState = React.useState,
  useRef = React.useRef,
  useMemo = React.useMemo;
var queryRendererContext = {
  rootIsQueryRenderer: true
};
function useDeepCompare(value) {
  var latestValue = React.useRef(value);
  if (!areEqual(latestValue.current, value)) {
    if (process.env.NODE_ENV !== "production") {
      deepFreeze(value);
    }
    latestValue.current = value;
  }
  return latestValue.current;
}
function ReactRelayLocalQueryRenderer(props) {
  var environment = props.environment,
    query = props.query,
    variables = props.variables,
    render = props.render;
  var latestVariables = useDeepCompare(variables);
  var operation = useMemo(function () {
    var request = getRequest(query);
    return createOperationDescriptor(request, latestVariables);
  }, [query, latestVariables]);
  var relayContext = useMemo(function () {
    return {
      environment: environment
    };
  }, [environment]);
  var dataRef = useRef(null);
  var _useState = useState(null),
    forceUpdate = _useState[1];
  var cleanupFnRef = useRef(null);
  var snapshot = useMemo(function () {
    environment.check(operation);
    var res = environment.lookup(operation.fragment);
    dataRef.current = res.data;
    var retainDisposable = environment.retain(operation);
    var subscribeDisposable = environment.subscribe(res, function (newSnapshot) {
      dataRef.current = newSnapshot.data;
      forceUpdate(dataRef.current);
    });
    var disposed = false;
    function nextCleanupFn() {
      if (!disposed) {
        disposed = true;
        cleanupFnRef.current = null;
        retainDisposable.dispose();
        subscribeDisposable.dispose();
      }
    }
    if (cleanupFnRef.current) {
      cleanupFnRef.current();
    }
    cleanupFnRef.current = nextCleanupFn;
    return res;
  }, [environment, operation]);
  useLayoutEffect(function () {
    var cleanupFn = cleanupFnRef.current;
    return function () {
      cleanupFn && cleanupFn();
    };
  }, [snapshot]);
  return /*#__PURE__*/React.createElement(ReactRelayContext.Provider, {
    value: relayContext
  }, /*#__PURE__*/React.createElement(ReactRelayQueryRendererContext.Provider, {
    value: queryRendererContext
  }, render({
    props: dataRef.current
  })));
}
module.exports = ReactRelayLocalQueryRenderer;