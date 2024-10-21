'use strict';

var _require = require('../store/RelayModernOperationDescriptor'),
  createOperationDescriptor = _require.createOperationDescriptor;
var _require2 = require('./GraphQLTag'),
  getRequest = _require2.getRequest;
function fetchQuery_DEPRECATED(environment, taggedNode, variables, cacheConfig) {
  var query = getRequest(taggedNode);
  if (query.params.operationKind !== 'query') {
    throw new Error('fetchQuery: Expected query operation');
  }
  var operation = createOperationDescriptor(query, variables, cacheConfig);
  return environment.execute({
    operation: operation
  }).map(function () {
    return environment.lookup(operation.fragment).data;
  }).toPromise();
}
module.exports = fetchQuery_DEPRECATED;