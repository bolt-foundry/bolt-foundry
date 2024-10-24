'use strict';

var _require = require('../query/fetchQueryInternal'),
  getPromiseForActiveRequest = _require.getPromiseForActiveRequest;
function getPendingOperationsForFragment(environment, fragmentNode, fragmentOwner) {
  var _pendingOperations$ma, _pendingOperations;
  var pendingOperations = [];
  var promise = getPromiseForActiveRequest(environment, fragmentOwner);
  if (promise != null) {
    pendingOperations = [fragmentOwner];
  } else {
    var _result$pendingOperat, _result$promise;
    var result = environment.getOperationTracker().getPendingOperationsAffectingOwner(fragmentOwner);
    pendingOperations = (_result$pendingOperat = result === null || result === void 0 ? void 0 : result.pendingOperations) !== null && _result$pendingOperat !== void 0 ? _result$pendingOperat : [];
    promise = (_result$promise = result === null || result === void 0 ? void 0 : result.promise) !== null && _result$promise !== void 0 ? _result$promise : null;
  }
  if (!promise) {
    return null;
  }
  var pendingOperationName = (_pendingOperations$ma = (_pendingOperations = pendingOperations) === null || _pendingOperations === void 0 ? void 0 : _pendingOperations.map(function (op) {
    return op.node.params.name;
  }).join(',')) !== null && _pendingOperations$ma !== void 0 ? _pendingOperations$ma : null;
  if (pendingOperationName == null || pendingOperationName.length === 0) {
    pendingOperationName = 'Unknown pending operation';
  }
  var fragmentName = fragmentNode.name;
  var promiseDisplayName = pendingOperationName === fragmentName ? "Relay(".concat(pendingOperationName, ")") : "Relay(".concat(pendingOperationName, ":").concat(fragmentName, ")");
  promise.displayName = promiseDisplayName;
  environment.__log({
    name: 'pendingoperation.found',
    fragment: fragmentNode,
    fragmentOwner: fragmentOwner,
    pendingOperations: pendingOperations
  });
  return {
    promise: promise,
    pendingOperations: pendingOperations
  };
}
module.exports = getPendingOperationsForFragment;