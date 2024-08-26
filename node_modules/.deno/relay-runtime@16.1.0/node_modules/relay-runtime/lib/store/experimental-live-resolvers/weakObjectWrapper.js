'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var isLiveStateValue = require('./isLiveStateValue');
var _require = require('./LiveResolverSuspenseSentinel'),
  isSuspenseSentinel = _require.isSuspenseSentinel;
var invariant = require('invariant');
function weakObjectWrapperLive(resolverFn, key, isPlural) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var liveState = resolverFn.apply(null, args);
    !isLiveStateValue(liveState) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Resolver is expected to return a LiveState value.') : invariant(false) : void 0;
    return (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, liveState), {}, {
      read: weakObjectWrapper(function () {
        return liveState.read();
      }, key, isPlural)
    });
  };
}
function weakObjectWrapper(resolverFn, key, isPlural) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var data = resolverFn.apply(null, args);
    if (data == null || isSuspenseSentinel(data)) {
      return data;
    }
    if (isPlural) {
      !Array.isArray(data) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Resolver is expected to return a plural value.') : invariant(false) : void 0;
      return data.map(function (item) {
        return (0, _defineProperty2["default"])({}, key, item);
      });
    } else {
      return (0, _defineProperty2["default"])({}, key, data);
    }
  };
}
module.exports = {
  weakObjectWrapperLive: weakObjectWrapperLive,
  weakObjectWrapper: weakObjectWrapper
};