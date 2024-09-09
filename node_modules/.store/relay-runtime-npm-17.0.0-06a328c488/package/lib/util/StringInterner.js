'use strict';

var internTable = new Map();
var nextIndex = 1;
var digits = initDigitTable();
var INTERN_PREFIX = '\t';
var ESCAPE_PREFIX = '\v';
function initDigitTable() {
  var digits = new Set();
  for (var i = 0; i < 10; ++i) {
    digits.add(i.toString());
  }
  return digits;
}
function escape(str) {
  if (str[0] === INTERN_PREFIX && digits.has(str[1]) || str[0] === ESCAPE_PREFIX) {
    return ESCAPE_PREFIX + str;
  }
  return str;
}
function intern(str, limit) {
  if (limit == null || str.length < limit) {
    return escape(str);
  }
  var internedString = internTable.get(str);
  if (internedString != null) {
    return internedString;
  }
  internedString = INTERN_PREFIX + nextIndex++;
  internTable.set(str, internedString);
  return internedString;
}
module.exports = {
  intern: intern
};