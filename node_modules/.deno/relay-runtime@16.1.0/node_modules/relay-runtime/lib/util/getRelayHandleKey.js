'use strict';

var _require = require('./RelayDefaultHandleKey'),
  DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;
var invariant = require('invariant');
function getRelayHandleKey(handleName, key, fieldName) {
  if (key && key !== DEFAULT_HANDLE_KEY) {
    return "__".concat(key, "_").concat(handleName);
  }
  !(fieldName != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'getRelayHandleKey: Expected either `fieldName` or `key` in `handle` to be provided') : invariant(false) : void 0;
  return "__".concat(fieldName, "_").concat(handleName);
}
module.exports = getRelayHandleKey;