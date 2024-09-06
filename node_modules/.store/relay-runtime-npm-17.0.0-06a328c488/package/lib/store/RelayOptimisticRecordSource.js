'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var RelayModernRecord = require('./RelayModernRecord');
var RelayRecordSource = require('./RelayRecordSource');
var invariant = require('invariant');
var UNPUBLISH_RECORD_SENTINEL = RelayModernRecord.fromObject(Object.freeze({
  __UNPUBLISH_RECORD_SENTINEL: true
}));
var RelayOptimisticRecordSource = /*#__PURE__*/function () {
  function RelayOptimisticRecordSource(base) {
    this._base = base;
    this._sink = RelayRecordSource.create();
  }
  var _proto = RelayOptimisticRecordSource.prototype;
  _proto.has = function has(dataID) {
    if (this._sink.has(dataID)) {
      var sinkRecord = this._sink.get(dataID);
      return sinkRecord !== UNPUBLISH_RECORD_SENTINEL;
    } else {
      return this._base.has(dataID);
    }
  };
  _proto.get = function get(dataID) {
    if (this._sink.has(dataID)) {
      var sinkRecord = this._sink.get(dataID);
      if (sinkRecord === UNPUBLISH_RECORD_SENTINEL) {
        return undefined;
      } else {
        return sinkRecord;
      }
    } else {
      return this._base.get(dataID);
    }
  };
  _proto.getStatus = function getStatus(dataID) {
    var record = this.get(dataID);
    if (record === undefined) {
      return 'UNKNOWN';
    } else if (record === null) {
      return 'NONEXISTENT';
    } else {
      return 'EXISTENT';
    }
  };
  _proto.clear = function clear() {
    this._base = RelayRecordSource.create();
    this._sink.clear();
  };
  _proto["delete"] = function _delete(dataID) {
    this._sink["delete"](dataID);
  };
  _proto.remove = function remove(dataID) {
    this._sink.set(dataID, UNPUBLISH_RECORD_SENTINEL);
  };
  _proto.set = function set(dataID, record) {
    this._sink.set(dataID, record);
  };
  _proto.getRecordIDs = function getRecordIDs() {
    return Object.keys(this.toJSON());
  };
  _proto.size = function size() {
    return Object.keys(this.toJSON()).length;
  };
  _proto.toJSON = function toJSON() {
    var _this = this;
    var merged = (0, _objectSpread2["default"])({}, this._base.toJSON());
    this._sink.getRecordIDs().forEach(function (dataID) {
      var record = _this.get(dataID);
      if (record === undefined) {
        delete merged[dataID];
      } else {
        merged[dataID] = RelayModernRecord.toJSON(record);
      }
    });
    return merged;
  };
  _proto.getOptimisticRecordIDs = function getOptimisticRecordIDs() {
    return new Set(this._sink.getRecordIDs());
  };
  return RelayOptimisticRecordSource;
}();
function create(base) {
  return new RelayOptimisticRecordSource(base);
}
function getOptimisticRecordIDs(source) {
  !(source instanceof RelayOptimisticRecordSource) ? process.env.NODE_ENV !== "production" ? invariant(false, 'getOptimisticRecordIDs: Instance of RelayOptimisticRecordSource is expected') : invariant(false) : void 0;
  return source.getOptimisticRecordIDs();
}
module.exports = {
  create: create,
  getOptimisticRecordIDs: getOptimisticRecordIDs
};