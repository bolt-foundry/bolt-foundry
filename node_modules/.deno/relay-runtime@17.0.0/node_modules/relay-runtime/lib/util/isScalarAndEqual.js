'use strict';

function isScalarAndEqual(valueA, valueB) {
  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
}
module.exports = isScalarAndEqual;