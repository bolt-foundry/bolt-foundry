'use strict';

var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var _require = require('../util/StringInterner'),
  intern = _require.intern;
var PREFIX = 'client:';
function generateClientID(id, storageKey, index) {
  var internedId = RelayFeatureFlags.STRING_INTERN_LEVEL <= 0 ? id : intern(id, RelayFeatureFlags.MAX_DATA_ID_LENGTH);
  var key = internedId + ':' + storageKey;
  if (index != null) {
    key += ':' + index;
  }
  if (key.indexOf(PREFIX) !== 0) {
    key = PREFIX + key;
  }
  return key;
}
function isClientID(id) {
  return id.indexOf(PREFIX) === 0;
}
var localID = 0;
function generateUniqueClientID() {
  return "".concat(PREFIX, "local:").concat(localID++);
}
function generateClientObjectClientID(typename, localId, index) {
  var key = "".concat(PREFIX).concat(typename, ":").concat(localId);
  if (index != null) {
    key += ':' + index;
  }
  return key;
}
module.exports = {
  generateClientID: generateClientID,
  generateClientObjectClientID: generateClientObjectClientID,
  generateUniqueClientID: generateUniqueClientID,
  isClientID: isClientID
};