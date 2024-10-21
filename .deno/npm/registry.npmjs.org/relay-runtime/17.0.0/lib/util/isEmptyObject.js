'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmptyObject(obj) {
  for (var _key in obj) {
    if (hasOwnProperty.call(obj, _key)) {
      return false;
    }
  }
  return true;
}
module.exports = isEmptyObject;