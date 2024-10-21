'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var RelayModernRecord = require('./RelayModernRecord');
var RelayRecordState = require('./RelayRecordState');
var EXISTENT = RelayRecordState.EXISTENT,
  NONEXISTENT = RelayRecordState.NONEXISTENT,
  UNKNOWN = RelayRecordState.UNKNOWN;
var RelayRecordSource = /*#__PURE__*/function () {
  function RelayRecordSource(records) {
    var _this = this;
    this._records = new Map();
    if (records != null) {
      Object.keys(records).forEach(function (key) {
        var object = records[key];
        var record = RelayModernRecord.fromObject(object);
        _this._records.set(key, record);
      });
    }
  }
  RelayRecordSource.create = function create(records) {
    return new RelayRecordSource(records);
  };
  var _proto = RelayRecordSource.prototype;
  _proto.clear = function clear() {
    this._records = new Map();
  };
  _proto["delete"] = function _delete(dataID) {
    this._records.set(dataID, null);
  };
  _proto.get = function get(dataID) {
    return this._records.get(dataID);
  };
  _proto.getRecordIDs = function getRecordIDs() {
    return Array.from(this._records.keys());
  };
  _proto.getStatus = function getStatus(dataID) {
    if (!this._records.has(dataID)) {
      return UNKNOWN;
    }
    return this._records.get(dataID) == null ? NONEXISTENT : EXISTENT;
  };
  _proto.has = function has(dataID) {
    return this._records.has(dataID);
  };
  _proto.remove = function remove(dataID) {
    this._records["delete"](dataID);
  };
  _proto.set = function set(dataID, record) {
    this._records.set(dataID, record);
  };
  _proto.size = function size() {
    return this._records.size;
  };
  _proto.toJSON = function toJSON() {
    var obj = {};
    var _iterator = (0, _createForOfIteratorHelper2["default"])(this._records),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _step.value,
          key = _step$value[0],
          record = _step$value[1];
        obj[key] = RelayModernRecord.toJSON(record);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return obj;
  };
  return RelayRecordSource;
}();
module.exports = RelayRecordSource;