'use strict';

var generateID = require('../util/generateID');
function wrapNetworkWithLogObserver(env, network) {
  return {
    execute: function execute(params, variables, cacheConfig, uploadables) {
      var networkRequestId = generateID();
      var logObserver = {
        start: function start(subscription) {
          env.__log({
            name: 'network.start',
            networkRequestId: networkRequestId,
            params: params,
            variables: variables,
            cacheConfig: cacheConfig
          });
        },
        next: function next(response) {
          env.__log({
            name: 'network.next',
            networkRequestId: networkRequestId,
            response: response
          });
        },
        error: function error(_error) {
          env.__log({
            name: 'network.error',
            networkRequestId: networkRequestId,
            error: _error
          });
        },
        complete: function complete() {
          env.__log({
            name: 'network.complete',
            networkRequestId: networkRequestId
          });
        },
        unsubscribe: function unsubscribe() {
          env.__log({
            name: 'network.unsubscribe',
            networkRequestId: networkRequestId
          });
        }
      };
      var logRequestInfo = function logRequestInfo(info) {
        env.__log({
          name: 'network.info',
          networkRequestId: networkRequestId,
          info: info
        });
      };
      return network.execute(params, variables, cacheConfig, uploadables, logRequestInfo)["do"](logObserver);
    }
  };
}
module.exports = wrapNetworkWithLogObserver;