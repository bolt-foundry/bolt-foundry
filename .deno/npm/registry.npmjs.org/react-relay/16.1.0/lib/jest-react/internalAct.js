'use strict';

var enqueueTask = require('./enqueueTask');
var Scheduler = require('scheduler/unstable_mock');
var actingUpdatesScopeDepth = 0;
function act(scope) {
  if (Scheduler.unstable_flushAllWithoutAsserting === undefined) {
    throw Error('This version of `act` requires a special mock build of Scheduler.');
  }
  if (setTimeout._isMockFunction !== true) {
    throw Error("This version of `act` requires Jest's timer mocks " + '(i.e. jest.useFakeTimers).');
  }
  var previousIsActEnvironment = global.IS_REACT_ACT_ENVIRONMENT;
  var previousActingUpdatesScopeDepth = actingUpdatesScopeDepth;
  actingUpdatesScopeDepth++;
  if (process.env.NODE_ENV !== "production" && actingUpdatesScopeDepth === 1) {
    global.IS_REACT_ACT_ENVIRONMENT = false;
  }
  var unwind = function unwind() {
    if (process.env.NODE_ENV !== "production" && actingUpdatesScopeDepth === 1) {
      global.IS_REACT_ACT_ENVIRONMENT = previousIsActEnvironment;
    }
    actingUpdatesScopeDepth--;
    if (process.env.NODE_ENV !== "production") {
      if (actingUpdatesScopeDepth > previousActingUpdatesScopeDepth) {
        console.error('You seem to have overlapping act() calls, this is not supported. ' + 'Be sure to await previous act() calls before making a new one. ');
      }
    }
  };
  try {
    var result = scope();
    if (typeof result === 'object' && result !== null && typeof result.then === 'function') {
      var thenableResult = result;
      return {
        then: function then(resolve, reject) {
          thenableResult.then(function (returnValue) {
            flushActWork(function () {
              unwind();
              resolve(returnValue);
            }, function (error) {
              unwind();
              reject(error);
            });
          }, function (error) {
            unwind();
            reject(error);
          });
        }
      };
    } else {
      var returnValue = result;
      try {
        var didFlushWork;
        do {
          didFlushWork = Scheduler.unstable_flushAllWithoutAsserting();
        } while (didFlushWork);
        return {
          then: function then(resolve, reject) {
            resolve(returnValue);
          }
        };
      } finally {
        unwind();
      }
    }
  } catch (error) {
    unwind();
    throw error;
  }
}
function flushActWork(resolve, reject) {
  jest.runOnlyPendingTimers();
  enqueueTask(function () {
    try {
      var didFlushWork = Scheduler.unstable_flushAllWithoutAsserting();
      if (didFlushWork) {
        flushActWork(resolve, reject);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}
exports.act = act;