"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGraphModeResponse = handleGraphModeResponse;
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var RelayModernRecord = require('./RelayModernRecord');
var invariant = require('invariant');
function handleGraphModeResponse(recordSource, response) {
  var handler = new GraphModeHandler(recordSource);
  return handler.populateRecordSource(response);
}
var GraphModeHandler = /*#__PURE__*/function () {
  function GraphModeHandler(recordSource) {
    this._recordSource = recordSource;
    this._streamIdToCacheKey = new Map();
  }
  var _proto = GraphModeHandler.prototype;
  _proto.populateRecordSource = function populateRecordSource(response) {
    var _iterator = (0, _createForOfIteratorHelper2["default"])(response),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var chunk = _step.value;
        switch (chunk.$kind) {
          case 'Record':
            this._handleRecordChunk(chunk);
            break;
          case 'Extend':
            {
              var cacheKey = this._lookupCacheKey(chunk.$streamID);
              var record = this._recordSource.get(cacheKey);
              !(record != null) ? process.env.NODE_ENV !== "production" ? invariant(false, "Expected to have a record for cache key ".concat(cacheKey)) : invariant(false) : void 0;
              this._populateRecord(record, chunk);
              break;
            }
          case 'Complete':
            this._streamIdToCacheKey.clear();
            break;
          default:
            chunk.$kind;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return this._recordSource;
  };
  _proto._handleRecordChunk = function _handleRecordChunk(chunk) {
    var cacheKey = chunk.__id;
    var record = this._recordSource.get(cacheKey);
    if (record == null) {
      record = RelayModernRecord.create(cacheKey, chunk.__typename);
      this._recordSource.set(cacheKey, record);
    }
    this._streamIdToCacheKey.set(chunk.$streamID, cacheKey);
    this._populateRecord(record, chunk);
  };
  _proto._populateRecord = function _populateRecord(parentRecord, chunk) {
    var _this = this;
    for (var _i = 0, _Object$entries = Object.entries(chunk); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _Object$entries[_i],
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      switch (key) {
        case '$streamID':
        case '$kind':
        case '__typename':
          break;
        default:
          if (typeof value !== 'object' || value == null || Array.isArray(value)) {
            RelayModernRecord.setValue(parentRecord, key, value);
          } else {
            if (value.hasOwnProperty('__id')) {
              var streamID = value.__id;
              var id = this._lookupCacheKey(streamID);
              RelayModernRecord.setLinkedRecordID(parentRecord, key, id);
            } else if (value.hasOwnProperty('__ids')) {
              var streamIDs = value.__ids;
              var ids = streamIDs.map(function (sID) {
                return sID == null ? null : _this._lookupCacheKey(sID);
              });
              RelayModernRecord.setLinkedRecordIDs(parentRecord, key, ids);
            } else {
              !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected object to have either __id or __ids.') : invariant(false) : void 0;
            }
          }
      }
    }
  };
  _proto._lookupCacheKey = function _lookupCacheKey(streamID) {
    var cacheKey = this._streamIdToCacheKey.get(streamID);
    !(cacheKey != null) ? process.env.NODE_ENV !== "production" ? invariant(false, "Expected to have a cacheKey for $streamID ".concat(streamID)) : invariant(false) : void 0;
    return cacheKey;
  };
  return GraphModeHandler;
}();