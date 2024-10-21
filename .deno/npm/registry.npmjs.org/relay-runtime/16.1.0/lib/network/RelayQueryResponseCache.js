'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var stableCopy = require('../util/stableCopy');
var invariant = require('invariant');
var RelayQueryResponseCache = /*#__PURE__*/function () {
  function RelayQueryResponseCache(_ref) {
    var size = _ref.size,
      ttl = _ref.ttl;
    !(size > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayQueryResponseCache: Expected the max cache size to be > 0, got ' + '`%s`.', size) : invariant(false) : void 0;
    !(ttl > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayQueryResponseCache: Expected the max ttl to be > 0, got `%s`.', ttl) : invariant(false) : void 0;
    this._responses = new Map();
    this._size = size;
    this._ttl = ttl;
  }
  var _proto = RelayQueryResponseCache.prototype;
  _proto.clear = function clear() {
    this._responses.clear();
  };
  _proto.get = function get(queryID, variables) {
    var _this = this;
    var cacheKey = getCacheKey(queryID, variables);
    this._responses.forEach(function (response, key) {
      if (!isCurrent(response.fetchTime, _this._ttl)) {
        _this._responses["delete"](key);
      }
    });
    var response = this._responses.get(cacheKey);
    if (response == null) {
      return null;
    }
    if (Array.isArray(response.payload)) {
      return response.payload.map(function (payload) {
        return (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, payload), {}, {
          extensions: (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, payload.extensions), {}, {
            cacheTimestamp: response.fetchTime
          })
        });
      });
    }
    return (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, response.payload), {}, {
      extensions: (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, response.payload.extensions), {}, {
        cacheTimestamp: response.fetchTime
      })
    });
  };
  _proto.set = function set(queryID, variables, payload) {
    var fetchTime = Date.now();
    var cacheKey = getCacheKey(queryID, variables);
    this._responses["delete"](cacheKey);
    this._responses.set(cacheKey, {
      fetchTime: fetchTime,
      payload: payload
    });
    if (this._responses.size > this._size) {
      var firstKey = this._responses.keys().next();
      if (!firstKey.done) {
        this._responses["delete"](firstKey.value);
      }
    }
  };
  return RelayQueryResponseCache;
}();
function getCacheKey(queryID, variables) {
  return JSON.stringify(stableCopy({
    queryID: queryID,
    variables: variables
  }));
}
function isCurrent(fetchTime, ttl) {
  return fetchTime + ttl >= Date.now();
}
module.exports = RelayQueryResponseCache;