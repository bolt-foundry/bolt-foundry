'use strict';

function isLiveStateValue(v) {
  return v != null && typeof v === 'object' && typeof v.read === 'function' && typeof v.subscribe === 'function';
}
module.exports = isLiveStateValue;