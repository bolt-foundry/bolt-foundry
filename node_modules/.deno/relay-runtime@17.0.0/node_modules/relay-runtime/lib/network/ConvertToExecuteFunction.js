'use strict';

var RelayObservable = require('./RelayObservable');
function convertFetch(fn) {
  return function fetch(request, variables, cacheConfig, uploadables, logRequestInfo) {
    var result = fn(request, variables, cacheConfig, uploadables, logRequestInfo);
    if (result instanceof Error) {
      return RelayObservable.create(function (sink) {
        return sink.error(result);
      });
    }
    return RelayObservable.from(result);
  };
}
module.exports = {
  convertFetch: convertFetch
};