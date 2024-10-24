'use strict';

var invariant = require('invariant');
var LRUCache = /*#__PURE__*/function () {
  function LRUCache(capacity) {
    this._capacity = capacity;
    !(this._capacity > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LRUCache: Unable to create instance of cache with zero or negative capacity.') : invariant(false) : void 0;
    this._map = new Map();
  }
  var _proto = LRUCache.prototype;
  _proto.set = function set(key, value) {
    this._map["delete"](key);
    this._map.set(key, value);
    if (this._map.size > this._capacity) {
      var firstKey = this._map.keys().next();
      if (!firstKey.done) {
        this._map["delete"](firstKey.value);
      }
    }
  };
  _proto.get = function get(key) {
    var value = this._map.get(key);
    if (value != null) {
      this._map["delete"](key);
      this._map.set(key, value);
    }
    return value;
  };
  _proto.has = function has(key) {
    return this._map.has(key);
  };
  _proto["delete"] = function _delete(key) {
    this._map["delete"](key);
  };
  _proto.size = function size() {
    return this._map.size;
  };
  _proto.capacity = function capacity() {
    return this._capacity - this._map.size;
  };
  _proto.clear = function clear() {
    this._map.clear();
  };
  return LRUCache;
}();
function create(capacity) {
  return new LRUCache(capacity);
}
module.exports = {
  create: create
};