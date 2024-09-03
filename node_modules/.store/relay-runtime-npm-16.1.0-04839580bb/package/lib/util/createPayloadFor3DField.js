'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _require = require('../store/RelayStoreUtils'),
  getModuleComponentKey = _require.getModuleComponentKey,
  getModuleOperationKey = _require.getModuleOperationKey;
function createPayloadFor3DField(name, operation, component, response) {
  var data = (0, _objectSpread2["default"])({}, response);
  data[getModuleComponentKey(name)] = component;
  data[getModuleOperationKey(name)] = operation;
  return data;
}
module.exports = createPayloadFor3DField;