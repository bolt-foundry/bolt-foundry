'use strict';

var _window, _window$performance;
var isPerformanceNowAvailable = typeof window !== 'undefined' && typeof ((_window = window) === null || _window === void 0 ? void 0 : (_window$performance = _window.performance) === null || _window$performance === void 0 ? void 0 : _window$performance.now) === 'function';
function currentTimestamp() {
  if (isPerformanceNowAvailable) {
    return window.performance.now();
  }
  return Date.now();
}
function withDuration(cb) {
  var startTime = currentTimestamp();
  var result = cb();
  return [currentTimestamp() - startTime, result];
}
module.exports = withDuration;