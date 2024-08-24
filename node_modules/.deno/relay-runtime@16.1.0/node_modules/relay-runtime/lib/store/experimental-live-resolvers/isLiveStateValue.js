'use strict';

module.exports = function isLiveStateValue(v) {
  return v != null && typeof v === 'object' && typeof v.read === 'function' && typeof v.subscribe === 'function';
};