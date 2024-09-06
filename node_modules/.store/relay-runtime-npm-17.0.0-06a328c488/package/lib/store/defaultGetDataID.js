'use strict';

var _require = require('./ViewerPattern'),
  VIEWER_ID = _require.VIEWER_ID,
  VIEWER_TYPE = _require.VIEWER_TYPE;
function defaultGetDataID(fieldValue, typeName) {
  if (typeName === VIEWER_TYPE) {
    return fieldValue.id == null ? VIEWER_ID : fieldValue.id;
  }
  return fieldValue.id;
}
module.exports = defaultGetDataID;