'use strict';

var ITERATOR_KEY = Symbol.iterator;
function hasOverlappingIDs(seenRecords, updatedRecordIDs) {
  var iterator = seenRecords[ITERATOR_KEY]();
  var next = iterator.next();
  while (!next.done) {
    var key = next.value;
    if (updatedRecordIDs.has(key)) {
      return true;
    }
    next = iterator.next();
  }
  return false;
}
module.exports = hasOverlappingIDs;