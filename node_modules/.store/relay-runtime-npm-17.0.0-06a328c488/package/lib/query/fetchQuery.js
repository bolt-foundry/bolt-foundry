'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var RelayObservable = require('../network/RelayObservable');
var _require = require('../store/RelayModernOperationDescriptor'),
  createOperationDescriptor = _require.createOperationDescriptor;
var handlePotentialSnapshotErrors = require('../util/handlePotentialSnapshotErrors');
var fetchQueryInternal = require('./fetchQueryInternal');
var _require2 = require('./GraphQLTag'),
  getRequest = _require2.getRequest;
var invariant = require('invariant');
function fetchQuery(environment, query, variables, options) {
  var _options$fetchPolicy;
  var queryNode = getRequest(query);
  !(queryNode.params.operationKind === 'query') ? process.env.NODE_ENV !== "production" ? invariant(false, 'fetchQuery: Expected query operation') : invariant(false) : void 0;
  var networkCacheConfig = (0, _objectSpread2["default"])({
    force: true
  }, options === null || options === void 0 ? void 0 : options.networkCacheConfig);
  var operation = createOperationDescriptor(queryNode, variables, networkCacheConfig);
  var fetchPolicy = (_options$fetchPolicy = options === null || options === void 0 ? void 0 : options.fetchPolicy) !== null && _options$fetchPolicy !== void 0 ? _options$fetchPolicy : 'network-only';
  function readData(snapshot) {
    var _queryNode$fragment$m, _queryNode$fragment$m2;
    handlePotentialSnapshotErrors(environment, snapshot.missingRequiredFields, snapshot.relayResolverErrors, snapshot.errorResponseFields, (_queryNode$fragment$m = (_queryNode$fragment$m2 = queryNode.fragment.metadata) === null || _queryNode$fragment$m2 === void 0 ? void 0 : _queryNode$fragment$m2.throwOnFieldError) !== null && _queryNode$fragment$m !== void 0 ? _queryNode$fragment$m : false);
    return snapshot.data;
  }
  switch (fetchPolicy) {
    case 'network-only':
      {
        return getNetworkObservable(environment, operation).map(readData);
      }
    case 'store-or-network':
      {
        if (environment.check(operation).status === 'available') {
          return RelayObservable.from(environment.lookup(operation.fragment)).map(readData);
        }
        return getNetworkObservable(environment, operation).map(readData);
      }
    default:
      fetchPolicy;
      throw new Error('fetchQuery: Invalid fetchPolicy ' + fetchPolicy);
  }
}
function getNetworkObservable(environment, operation) {
  return fetchQueryInternal.fetchQuery(environment, operation).map(function () {
    return environment.lookup(operation.fragment);
  });
}
module.exports = fetchQuery;