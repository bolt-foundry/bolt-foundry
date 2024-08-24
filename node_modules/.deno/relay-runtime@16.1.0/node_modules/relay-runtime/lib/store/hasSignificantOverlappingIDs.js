'use strict';

var _require = require('./RelayStoreUtils'),
  ROOT_ID = _require.ROOT_ID;
var _require2 = require('./ViewerPattern'),
  VIEWER_ID = _require2.VIEWER_ID;
var ITERATOR_KEY = Symbol.iterator;
function hasSignificantOverlappingIDs(seenRecords, updatedRecordIDs) {
  var iterator = seenRecords[ITERATOR_KEY]();
  var next = iterator.next();
  while (!next.done) {
    var key = next.value;
    if (updatedRecordIDs.has(key) && key !== ROOT_ID && key !== VIEWER_ID) {
      return true;
    }
    next = iterator.next();
  }
  return false;
}
module.exports = hasSignificantOverlappingIDs;