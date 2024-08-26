'use strict';

module.exports = function shallowFreeze(value) {
  if (typeof value === 'object' && value != null && (Array.isArray(value) || value.constructor === Object)) {
    Object.freeze(value);
  }
};