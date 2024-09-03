'use strict';

var withProvidedVariables = require('../util/withProvidedVariables');
var _require = require('./ConvertToExecuteFunction'),
  convertFetch = _require.convertFetch;
var invariant = require('invariant');
function create(fetchFn, subscribe) {
  var observeFetch = convertFetch(fetchFn);
  function execute(request, variables, cacheConfig, uploadables, logRequestInfo) {
    var operationVariables = withProvidedVariables(variables, request.providedVariables);
    if (request.operationKind === 'subscription') {
      !subscribe ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayNetwork: This network layer does not support Subscriptions. ' + 'To use Subscriptions, provide a custom network layer.') : invariant(false) : void 0;
      !!uploadables ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayNetwork: Cannot provide uploadables while subscribing.') : invariant(false) : void 0;
      return subscribe(request, operationVariables, cacheConfig);
    }
    var pollInterval = cacheConfig.poll;
    if (pollInterval != null) {
      !!uploadables ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayNetwork: Cannot provide uploadables while polling.') : invariant(false) : void 0;
      return observeFetch(request, operationVariables, {
        force: true
      }).poll(pollInterval);
    }
    return observeFetch(request, operationVariables, cacheConfig, uploadables, logRequestInfo);
  }
  return {
    execute: execute
  };
}
module.exports = {
  create: create
};