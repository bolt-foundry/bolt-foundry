'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var useLazyLoadQuery = require('./useLazyLoadQuery');
function useClientQuery(gqlQuery, variables, options) {
  var query = gqlQuery;
  return useLazyLoadQuery(query, variables, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, options), {}, {
    fetchPolicy: 'store-only'
  }));
}
module.exports = useClientQuery;