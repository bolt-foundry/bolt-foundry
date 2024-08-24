'use strict';

var useMemoVariables = require('./useMemoVariables');
var React = require('react');
var _require = require('relay-runtime'),
  createOperationDescriptor = _require.createOperationDescriptor,
  getRequest = _require.getRequest;
var useMemo = React.useMemo;
function useMemoOperationDescriptor(gqlQuery, variables, cacheConfig) {
  var memoVariables = useMemoVariables(variables);
  var memoCacheConfig = useMemoVariables(cacheConfig || {});
  return useMemo(function () {
    return createOperationDescriptor(getRequest(gqlQuery), memoVariables, memoCacheConfig);
  }, [gqlQuery, memoVariables, memoCacheConfig]);
}
module.exports = useMemoOperationDescriptor;