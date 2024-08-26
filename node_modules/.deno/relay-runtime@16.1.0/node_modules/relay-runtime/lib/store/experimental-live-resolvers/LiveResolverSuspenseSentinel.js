'use strict';

var LIVE_RESOLVER_SUSPENSE_SENTINEL = Object.freeze({
  __LIVE_RESOLVER_SUSPENSE_SENTINEL: true
});
function suspenseSentinel() {
  return LIVE_RESOLVER_SUSPENSE_SENTINEL;
}
function isSuspenseSentinel(value) {
  return value === LIVE_RESOLVER_SUSPENSE_SENTINEL;
}
module.exports = {
  isSuspenseSentinel: isSuspenseSentinel,
  suspenseSentinel: suspenseSentinel
};