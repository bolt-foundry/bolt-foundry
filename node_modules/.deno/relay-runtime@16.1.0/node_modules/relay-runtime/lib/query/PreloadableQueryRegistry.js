'use strict';

var PreloadableQueryRegistry = /*#__PURE__*/function () {
  function PreloadableQueryRegistry() {
    this._preloadableQueries = new Map();
    this._callbacks = new Map();
  }
  var _proto = PreloadableQueryRegistry.prototype;
  _proto.set = function set(key, value) {
    this._preloadableQueries.set(key, value);
    var callbacks = this._callbacks.get(key);
    if (callbacks != null) {
      callbacks.forEach(function (cb) {
        try {
          cb(value);
        } catch (e) {
          setTimeout(function () {
            throw e;
          }, 0);
        }
      });
    }
  };
  _proto.get = function get(key) {
    return this._preloadableQueries.get(key);
  };
  _proto.onLoad = function onLoad(key, callback) {
    var _this$_callbacks$get;
    var callbacks = (_this$_callbacks$get = this._callbacks.get(key)) !== null && _this$_callbacks$get !== void 0 ? _this$_callbacks$get : new Set();
    callbacks.add(callback);
    var dispose = function dispose() {
      callbacks["delete"](callback);
    };
    this._callbacks.set(key, callbacks);
    return {
      dispose: dispose
    };
  };
  _proto.clear = function clear() {
    this._preloadableQueries.clear();
  };
  return PreloadableQueryRegistry;
}();
var preloadableQueryRegistry = new PreloadableQueryRegistry();
module.exports = preloadableQueryRegistry;