'use strict';

function deepFreeze(object) {
  if (!shouldBeFrozen(object)) {
    return object;
  }
  Object.freeze(object);
  Object.getOwnPropertyNames(object).forEach(function (name) {
    var property = object[name];
    if (property && typeof property === 'object' && !Object.isFrozen(property)) {
      deepFreeze(property);
    }
  });
  return object;
}
function shouldBeFrozen(value) {
  return value != null && (Array.isArray(value) || typeof value === 'object' && value.constructor === Object);
}
module.exports = deepFreeze;