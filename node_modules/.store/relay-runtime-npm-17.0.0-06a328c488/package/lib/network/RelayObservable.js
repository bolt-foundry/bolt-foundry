'use strict';

var isPromise = require('../util/isPromise');
var hostReportError = swallowError;
var RelayObservable = /*#__PURE__*/function () {
  RelayObservable.create = function create(source) {
    return new RelayObservable(source);
  };
  function RelayObservable(source) {
    if (process.env.NODE_ENV !== "production") {
      if (!source || typeof source !== 'function') {
        throw new Error('Source must be a Function: ' + String(source));
      }
    }
    this._source = source;
  }
  RelayObservable.onUnhandledError = function onUnhandledError(callback) {
    hostReportError = callback;
  };
  RelayObservable.from = function from(obj) {
    return isObservable(obj) ? fromObservable(obj) : isPromise(obj) ? fromPromise(obj) : fromValue(obj);
  };
  var _proto = RelayObservable.prototype;
  _proto["catch"] = function _catch(fn) {
    var _this = this;
    return RelayObservable.create(function (sink) {
      var subscription;
      _this.subscribe({
        start: function start(sub) {
          subscription = sub;
        },
        next: sink.next,
        complete: sink.complete,
        error: function error(_error2) {
          try {
            fn(_error2).subscribe({
              start: function start(sub) {
                subscription = sub;
              },
              next: sink.next,
              complete: sink.complete,
              error: sink.error
            });
          } catch (error2) {
            sink.error(error2, true);
          }
        }
      });
      return function () {
        return subscription.unsubscribe();
      };
    });
  };
  _proto.concat = function concat(next) {
    var _this2 = this;
    return RelayObservable.create(function (sink) {
      var current;
      _this2.subscribe({
        start: function start(subscription) {
          current = subscription;
        },
        next: sink.next,
        error: sink.error,
        complete: function complete() {
          current = next.subscribe(sink);
        }
      });
      return function () {
        current && current.unsubscribe();
      };
    });
  };
  _proto["do"] = function _do(observer) {
    var _this3 = this;
    return RelayObservable.create(function (sink) {
      var both = function both(action) {
        return function () {
          try {
            observer[action] && observer[action].apply(observer, arguments);
          } catch (error) {
            hostReportError(error, true);
          }
          sink[action] && sink[action].apply(sink, arguments);
        };
      };
      return _this3.subscribe({
        start: both('start'),
        next: both('next'),
        error: both('error'),
        complete: both('complete'),
        unsubscribe: both('unsubscribe')
      });
    });
  };
  _proto["finally"] = function _finally(fn) {
    var _this4 = this;
    return RelayObservable.create(function (sink) {
      var subscription = _this4.subscribe(sink);
      return function () {
        subscription.unsubscribe();
        fn();
      };
    });
  };
  _proto.ifEmpty = function ifEmpty(alternate) {
    var _this5 = this;
    return RelayObservable.create(function (sink) {
      var hasValue = false;
      var current;
      current = _this5.subscribe({
        next: function next(value) {
          hasValue = true;
          sink.next(value);
        },
        error: sink.error,
        complete: function complete() {
          if (hasValue) {
            sink.complete();
          } else {
            current = alternate.subscribe(sink);
          }
        }
      });
      return function () {
        current && current.unsubscribe();
      };
    });
  };
  _proto.subscribe = function subscribe(observer) {
    if (process.env.NODE_ENV !== "production") {
      if (!observer || typeof observer !== 'object') {
        throw new Error('Observer must be an Object with callbacks: ' + String(observer));
      }
    }
    return _subscribe(this._source, observer);
  };
  _proto.map = function map(fn) {
    var _this6 = this;
    return RelayObservable.create(function (sink) {
      var subscription = _this6.subscribe({
        complete: sink.complete,
        error: sink.error,
        next: function next(value) {
          try {
            var mapValue = fn(value);
            sink.next(mapValue);
          } catch (error) {
            sink.error(error, true);
          }
        }
      });
      return function () {
        subscription.unsubscribe();
      };
    });
  };
  _proto.mergeMap = function mergeMap(fn) {
    var _this7 = this;
    return RelayObservable.create(function (sink) {
      var subscriptions = [];
      function start(subscription) {
        this._sub = subscription;
        subscriptions.push(subscription);
      }
      function complete() {
        subscriptions.splice(subscriptions.indexOf(this._sub), 1);
        if (subscriptions.length === 0) {
          sink.complete();
        }
      }
      _this7.subscribe({
        start: start,
        next: function next(value) {
          try {
            if (!sink.closed) {
              RelayObservable.from(fn(value)).subscribe({
                start: start,
                next: sink.next,
                error: sink.error,
                complete: complete
              });
            }
          } catch (error) {
            sink.error(error, true);
          }
        },
        error: sink.error,
        complete: complete
      });
      return function () {
        subscriptions.forEach(function (sub) {
          return sub.unsubscribe();
        });
        subscriptions.length = 0;
      };
    });
  };
  _proto.poll = function poll(pollInterval) {
    var _this8 = this;
    if (process.env.NODE_ENV !== "production") {
      if (typeof pollInterval !== 'number' || pollInterval <= 0) {
        throw new Error('RelayObservable: Expected pollInterval to be positive, got: ' + pollInterval);
      }
    }
    return RelayObservable.create(function (sink) {
      var subscription;
      var timeout;
      var poll = function poll() {
        subscription = _this8.subscribe({
          next: sink.next,
          error: sink.error,
          complete: function complete() {
            timeout = setTimeout(poll, pollInterval);
          }
        });
      };
      poll();
      return function () {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    });
  };
  _proto.toPromise = function toPromise() {
    var _this9 = this;
    return new Promise(function (resolve, reject) {
      var resolved = false;
      _this9.subscribe({
        next: function next(val) {
          if (!resolved) {
            resolved = true;
            resolve(val);
          }
        },
        error: reject,
        complete: resolve
      });
    });
  };
  return RelayObservable;
}();
function isObservable(obj) {
  return typeof obj === 'object' && obj !== null && typeof obj.subscribe === 'function';
}
function fromObservable(obj) {
  return obj instanceof RelayObservable ? obj : RelayObservable.create(function (sink) {
    return obj.subscribe(sink);
  });
}
function fromPromise(promise) {
  return RelayObservable.create(function (sink) {
    promise.then(function (value) {
      sink.next(value);
      sink.complete();
    }, sink.error);
  });
}
function fromValue(value) {
  return RelayObservable.create(function (sink) {
    sink.next(value);
    sink.complete();
  });
}
function _subscribe(source, observer) {
  var closed = false;
  var cleanup;
  var withClosed = function withClosed(obj) {
    return Object.defineProperty(obj, 'closed', {
      get: function get() {
        return closed;
      }
    });
  };
  function doCleanup() {
    if (cleanup) {
      if (cleanup.unsubscribe) {
        cleanup.unsubscribe();
      } else {
        try {
          cleanup();
        } catch (error) {
          hostReportError(error, true);
        }
      }
      cleanup = undefined;
    }
  }
  var subscription = withClosed({
    unsubscribe: function unsubscribe() {
      if (!closed) {
        closed = true;
        try {
          observer.unsubscribe && observer.unsubscribe(subscription);
        } catch (error) {
          hostReportError(error, true);
        } finally {
          doCleanup();
        }
      }
    }
  });
  try {
    observer.start && observer.start(subscription);
  } catch (error) {
    hostReportError(error, true);
  }
  if (closed) {
    return subscription;
  }
  var sink = withClosed({
    next: function next(value) {
      if (!closed && observer.next) {
        try {
          observer.next(value);
        } catch (error) {
          hostReportError(error, true);
        }
      }
    },
    error: function error(_error3, isUncaughtThrownError) {
      if (closed || !observer.error) {
        closed = true;
        hostReportError(_error3, isUncaughtThrownError || false);
        doCleanup();
      } else {
        closed = true;
        try {
          observer.error(_error3);
        } catch (error2) {
          hostReportError(error2, true);
        } finally {
          doCleanup();
        }
      }
    },
    complete: function complete() {
      if (!closed) {
        closed = true;
        try {
          observer.complete && observer.complete();
        } catch (error) {
          hostReportError(error, true);
        } finally {
          doCleanup();
        }
      }
    }
  });
  try {
    cleanup = source(sink);
  } catch (error) {
    sink.error(error, true);
  }
  if (process.env.NODE_ENV !== "production") {
    if (cleanup !== undefined && typeof cleanup !== 'function' && (!cleanup || typeof cleanup.unsubscribe !== 'function')) {
      throw new Error('Returned cleanup function which cannot be called: ' + String(cleanup));
    }
  }
  if (closed) {
    doCleanup();
  }
  return subscription;
}
function swallowError(_error, _isUncaughtThrownError) {}
if (process.env.NODE_ENV !== "production") {
  RelayObservable.onUnhandledError(function (error, isUncaughtThrownError) {
    if (typeof fail === 'function') {
      fail(String(error));
    } else if (isUncaughtThrownError) {
      setTimeout(function () {
        throw error;
      });
    } else if (typeof console !== 'undefined') {
      console.error('RelayObservable: Unhandled Error', error);
    }
  });
}
module.exports = RelayObservable;