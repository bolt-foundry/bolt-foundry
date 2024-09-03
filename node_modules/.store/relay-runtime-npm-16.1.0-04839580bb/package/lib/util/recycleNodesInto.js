'use strict';

function recycleNodesInto(prevData, nextData) {
  return recycleNodesIntoImpl(prevData, nextData, true);
}
function recycleNodesIntoImpl(prevData, nextData, canMutate) {
  if (prevData === nextData || typeof prevData !== 'object' || !prevData || prevData.constructor !== Object && !Array.isArray(prevData) || typeof nextData !== 'object' || !nextData || nextData.constructor !== Object && !Array.isArray(nextData)) {
    return nextData;
  }
  var canRecycle = false;
  var prevArray = Array.isArray(prevData) ? prevData : null;
  var nextArray = Array.isArray(nextData) ? nextData : null;
  if (prevArray && nextArray) {
    var canMutateNext = canMutate && !Object.isFrozen(nextArray);
    canRecycle = nextArray.reduce(function (wasEqual, nextItem, ii) {
      var prevValue = prevArray[ii];
      var nextValue = recycleNodesIntoImpl(prevValue, nextItem, canMutateNext);
      if (nextValue !== nextArray[ii] && canMutateNext) {
        nextArray[ii] = nextValue;
      }
      return wasEqual && nextValue === prevArray[ii];
    }, true) && prevArray.length === nextArray.length;
  } else if (!prevArray && !nextArray) {
    var prevObject = prevData;
    var nextObject = nextData;
    var prevKeys = Object.keys(prevObject);
    var nextKeys = Object.keys(nextObject);
    var _canMutateNext = canMutate && !Object.isFrozen(nextObject);
    canRecycle = nextKeys.reduce(function (wasEqual, key) {
      var prevValue = prevObject[key];
      var nextValue = recycleNodesIntoImpl(prevValue, nextObject[key], _canMutateNext);
      if (nextValue !== nextObject[key] && _canMutateNext) {
        nextObject[key] = nextValue;
      }
      return wasEqual && nextValue === prevObject[key];
    }, true) && prevKeys.length === nextKeys.length;
  }
  return canRecycle ? prevData : nextData;
}
module.exports = recycleNodesInto;