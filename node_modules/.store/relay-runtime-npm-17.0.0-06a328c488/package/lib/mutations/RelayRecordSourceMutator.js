'use strict';

var RelayModernRecord = require('../store/RelayModernRecord');
var _require = require('../store/RelayRecordState'),
  EXISTENT = _require.EXISTENT;
var invariant = require('invariant');
var RelayRecordSourceMutator = /*#__PURE__*/function () {
  function RelayRecordSourceMutator(base, sink) {
    this.__sources = [sink, base];
    this._base = base;
    this._sink = sink;
  }
  var _proto = RelayRecordSourceMutator.prototype;
  _proto.unstable_getRawRecordWithChanges = function unstable_getRawRecordWithChanges(dataID) {
    var baseRecord = this._base.get(dataID);
    var sinkRecord = this._sink.get(dataID);
    if (sinkRecord === undefined) {
      if (baseRecord == null) {
        return baseRecord;
      }
      var nextRecord = RelayModernRecord.clone(baseRecord);
      if (process.env.NODE_ENV !== "production") {
        RelayModernRecord.freeze(nextRecord);
      }
      return nextRecord;
    } else if (sinkRecord === null) {
      return null;
    } else if (baseRecord != null) {
      var _nextRecord = RelayModernRecord.update(baseRecord, sinkRecord);
      if (process.env.NODE_ENV !== "production") {
        if (_nextRecord !== baseRecord) {
          RelayModernRecord.freeze(_nextRecord);
        }
      }
      return _nextRecord;
    } else {
      var _nextRecord2 = RelayModernRecord.clone(sinkRecord);
      if (process.env.NODE_ENV !== "production") {
        RelayModernRecord.freeze(_nextRecord2);
      }
      return _nextRecord2;
    }
  };
  _proto._getSinkRecord = function _getSinkRecord(dataID) {
    var sinkRecord = this._sink.get(dataID);
    if (!sinkRecord) {
      var baseRecord = this._base.get(dataID);
      !baseRecord ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayRecordSourceMutator: Cannot modify non-existent record `%s`.', dataID) : invariant(false) : void 0;
      sinkRecord = RelayModernRecord.create(dataID, RelayModernRecord.getType(baseRecord));
      this._sink.set(dataID, sinkRecord);
    }
    return sinkRecord;
  };
  _proto.copyFields = function copyFields(sourceID, sinkID) {
    var sinkSource = this._sink.get(sourceID);
    var baseSource = this._base.get(sourceID);
    !(sinkSource || baseSource) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayRecordSourceMutator#copyFields(): Cannot copy fields from ' + 'non-existent record `%s`.', sourceID) : invariant(false) : void 0;
    var sink = this._getSinkRecord(sinkID);
    if (baseSource) {
      RelayModernRecord.copyFields(baseSource, sink);
    }
    if (sinkSource) {
      RelayModernRecord.copyFields(sinkSource, sink);
    }
  };
  _proto.copyFieldsFromRecord = function copyFieldsFromRecord(record, sinkID) {
    var sink = this._getSinkRecord(sinkID);
    RelayModernRecord.copyFields(record, sink);
  };
  _proto.create = function create(dataID, typeName) {
    !(this._base.getStatus(dataID) !== EXISTENT && this._sink.getStatus(dataID) !== EXISTENT) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayRecordSourceMutator#create(): Cannot create a record with id ' + '`%s`, this record already exists.', dataID) : invariant(false) : void 0;
    var record = RelayModernRecord.create(dataID, typeName);
    this._sink.set(dataID, record);
  };
  _proto["delete"] = function _delete(dataID) {
    this._sink["delete"](dataID);
  };
  _proto.getStatus = function getStatus(dataID) {
    return this._sink.has(dataID) ? this._sink.getStatus(dataID) : this._base.getStatus(dataID);
  };
  _proto.getType = function getType(dataID) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        return RelayModernRecord.getType(record);
      } else if (record === null) {
        return null;
      }
    }
  };
  _proto.getValue = function getValue(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var value = RelayModernRecord.getValue(record, storageKey);
        if (value !== undefined) {
          return value;
        }
      } else if (record === null) {
        return null;
      }
    }
  };
  _proto.setValue = function setValue(dataID, storageKey, value) {
    var sinkRecord = this._getSinkRecord(dataID);
    RelayModernRecord.setValue(sinkRecord, storageKey, value);
  };
  _proto.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
        if (linkedID !== undefined) {
          return linkedID;
        }
      } else if (record === null) {
        return null;
      }
    }
  };
  _proto.setLinkedRecordID = function setLinkedRecordID(dataID, storageKey, linkedID) {
    var sinkRecord = this._getSinkRecord(dataID);
    RelayModernRecord.setLinkedRecordID(sinkRecord, storageKey, linkedID);
  };
  _proto.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);
        if (linkedIDs !== undefined) {
          return linkedIDs;
        }
      } else if (record === null) {
        return null;
      }
    }
  };
  _proto.setLinkedRecordIDs = function setLinkedRecordIDs(dataID, storageKey, linkedIDs) {
    var sinkRecord = this._getSinkRecord(dataID);
    RelayModernRecord.setLinkedRecordIDs(sinkRecord, storageKey, linkedIDs);
  };
  return RelayRecordSourceMutator;
}();
module.exports = RelayRecordSourceMutator;