'use strict';

function isPromise(p) {
  return !!p && typeof p.then === 'function';
}
module.exports = isPromise;