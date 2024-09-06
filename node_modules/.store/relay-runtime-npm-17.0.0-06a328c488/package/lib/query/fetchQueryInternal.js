'use strict';

var Observable = require('../network/RelayObservable');
var RelayReplaySubject = require('../util/RelayReplaySubject');
var invariant = require('invariant');
var WEAKMAP_SUPPORTED = typeof WeakMap === 'function';
var requestCachesByEnvironment = WEAKMAP_SUPPORTED ? new WeakMap() : new Map();
function fetchQuery(environment, operation) {
  return fetchQueryDeduped(environment, operation.request.identifier, function () {
    return environment.execute({
      operation: operation
    });
  });
}
function fetchQueryDeduped(environment, identifier, fetchFn) {
  return Observable.create(function (sink) {
    var requestCache = getRequestCache(environment);
    var cachedRequest = requestCache.get(identifier);
    if (!cachedRequest) {
      fetchFn()["finally"](function () {
        return requestCache["delete"](identifier);
      }).subscribe({
        start: function start(subscription) {
          cachedRequest = {
            identifier: identifier,
            subject: new RelayReplaySubject(),
            subjectForInFlightStatus: new RelayReplaySubject(),
            subscription: subscription,
            promise: null
          };
          requestCache.set(identifier, cachedRequest);
        },
        next: function next(response) {
          var cachedReq = getCachedRequest(requestCache, identifier);
          cachedReq.subject.next(response);
          cachedReq.subjectForInFlightStatus.next(response);
        },
        error: function error(_error) {
          var cachedReq = getCachedRequest(requestCache, identifier);
          cachedReq.subject.error(_error);
          cachedReq.subjectForInFlightStatus.error(_error);
        },
        complete: function complete() {
          var cachedReq = getCachedRequest(requestCache, identifier);
          cachedReq.subject.complete();
          cachedReq.subjectForInFlightStatus.complete();
        },
        unsubscribe: function unsubscribe(subscription) {
          var cachedReq = getCachedRequest(requestCache, identifier);
          cachedReq.subject.unsubscribe();
          cachedReq.subjectForInFlightStatus.unsubscribe();
        }
      });
    }
    !(cachedRequest != null) ? process.env.NODE_ENV !== "production" ? invariant(false, '[fetchQueryInternal] fetchQueryDeduped: Expected `start` to be ' + 'called synchronously') : invariant(false) : void 0;
    return getObservableForCachedRequest(requestCache, cachedRequest).subscribe(sink);
  });
}
function getObservableForCachedRequest(requestCache, cachedRequest) {
  return Observable.create(function (sink) {
    var subscription = cachedRequest.subject.subscribe(sink);
    return function () {
      subscription.unsubscribe();
      var cachedRequestInstance = requestCache.get(cachedRequest.identifier);
      if (cachedRequestInstance) {
        var requestSubscription = cachedRequestInstance.subscription;
        if (requestSubscription != null && cachedRequestInstance.subject.getObserverCount() === 0) {
          requestSubscription.unsubscribe();
          requestCache["delete"](cachedRequest.identifier);
        }
      }
    };
  });
}
function getActiveStatusObservableForCachedRequest(environment, requestCache, cachedRequest) {
  return Observable.create(function (sink) {
    var subscription = cachedRequest.subjectForInFlightStatus.subscribe({
      error: sink.error,
      next: function next(response) {
        if (!environment.isRequestActive(cachedRequest.identifier)) {
          sink.complete();
          return;
        }
        sink.next();
      },
      complete: sink.complete,
      unsubscribe: sink.complete
    });
    return function () {
      subscription.unsubscribe();
    };
  });
}
function getPromiseForActiveRequest(environment, request) {
  var requestCache = getRequestCache(environment);
  var cachedRequest = requestCache.get(request.identifier);
  if (!cachedRequest) {
    return null;
  }
  if (!environment.isRequestActive(cachedRequest.identifier)) {
    return null;
  }
  var promise = new Promise(function (resolve, reject) {
    var resolveOnNext = false;
    getActiveStatusObservableForCachedRequest(environment, requestCache, cachedRequest).subscribe({
      complete: resolve,
      error: reject,
      next: function next(response) {
        if (resolveOnNext) {
          resolve(response);
        }
      }
    });
    resolveOnNext = true;
  });
  return promise;
}
function getObservableForActiveRequest(environment, request) {
  var requestCache = getRequestCache(environment);
  var cachedRequest = requestCache.get(request.identifier);
  if (!cachedRequest) {
    return null;
  }
  if (!environment.isRequestActive(cachedRequest.identifier)) {
    return null;
  }
  return getActiveStatusObservableForCachedRequest(environment, requestCache, cachedRequest);
}
function getRequestCache(environment) {
  var cached = requestCachesByEnvironment.get(environment);
  if (cached != null) {
    return cached;
  }
  var requestCache = new Map();
  requestCachesByEnvironment.set(environment, requestCache);
  return requestCache;
}
function getCachedRequest(requestCache, identifier) {
  var cached = requestCache.get(identifier);
  !(cached != null) ? process.env.NODE_ENV !== "production" ? invariant(false, '[fetchQueryInternal] getCachedRequest: Expected request to be cached') : invariant(false) : void 0;
  return cached;
}
module.exports = {
  fetchQuery: fetchQuery,
  fetchQueryDeduped: fetchQueryDeduped,
  getPromiseForActiveRequest: getPromiseForActiveRequest,
  getObservableForActiveRequest: getObservableForActiveRequest
};