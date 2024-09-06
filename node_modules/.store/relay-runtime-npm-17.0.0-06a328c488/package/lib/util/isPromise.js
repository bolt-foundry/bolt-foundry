'use strict';

function isPromise(p) {
  return p != null && typeof p === 'object' && typeof p.then === 'function';
}
module.exports = isPromise;