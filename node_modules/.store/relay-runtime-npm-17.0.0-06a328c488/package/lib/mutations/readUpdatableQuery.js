'use strict';

var _require = require('../query/GraphQLTag'),
  getUpdatableQuery = _require.getUpdatableQuery;
var _require2 = require('./createUpdatableProxy'),
  createUpdatableProxy = _require2.createUpdatableProxy;
function readUpdatableQuery(query, variables, proxy, missingFieldHandlers) {
  var updatableQuery = getUpdatableQuery(query);
  return {
    updatableData: createUpdatableProxy(proxy.getRoot(), variables, updatableQuery.fragment.selections, proxy, missingFieldHandlers)
  };
}
module.exports = {
  readUpdatableQuery: readUpdatableQuery
};