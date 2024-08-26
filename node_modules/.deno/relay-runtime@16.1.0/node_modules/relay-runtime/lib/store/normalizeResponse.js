'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _RelayModernRecord = _interopRequireDefault(require("./RelayModernRecord"));
var _RelayRecordSource = _interopRequireDefault(require("./RelayRecordSource"));
var _RelayResponseNormalizer = _interopRequireDefault(require("./RelayResponseNormalizer"));
function normalizeResponse(response, selector, typeName, options) {
  var _response$extensions;
  var data = response.data,
    errors = response.errors;
  var source = _RelayRecordSource["default"].create();
  var record = _RelayModernRecord["default"].create(selector.dataID, typeName);
  source.set(selector.dataID, record);
  var relayPayload = _RelayResponseNormalizer["default"].normalize(source, selector, data, options, errors);
  return (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, relayPayload), {}, {
    isFinal: ((_response$extensions = response.extensions) === null || _response$extensions === void 0 ? void 0 : _response$extensions.is_final) === true
  });
}
module.exports = normalizeResponse;