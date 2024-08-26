'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var recycleNodesInto = require('../util/recycleNodesInto');
var _require = require('../util/RelayConcreteNode'),
  RELAY_LIVE_RESOLVER = _require.RELAY_LIVE_RESOLVER;
var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var shallowFreeze = require('../util/shallowFreeze');
var _require2 = require('./ClientID'),
  generateClientID = _require2.generateClientID;
var RelayModernRecord = require('./RelayModernRecord');
var _require3 = require('./RelayStoreUtils'),
  RELAY_RESOLVER_ERROR_KEY = _require3.RELAY_RESOLVER_ERROR_KEY,
  RELAY_RESOLVER_INVALIDATION_KEY = _require3.RELAY_RESOLVER_INVALIDATION_KEY,
  RELAY_RESOLVER_SNAPSHOT_KEY = _require3.RELAY_RESOLVER_SNAPSHOT_KEY,
  RELAY_RESOLVER_VALUE_KEY = _require3.RELAY_RESOLVER_VALUE_KEY,
  getStorageKey = _require3.getStorageKey;
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
var emptySet = new Set();
var NoopResolverCache = /*#__PURE__*/function () {
  function NoopResolverCache() {}
  var _proto = NoopResolverCache.prototype;
  _proto.readFromCacheOrEvaluate = function readFromCacheOrEvaluate(recordID, field, variables, evaluate, getDataForResolverFragment) {
    !(field.kind !== RELAY_LIVE_RESOLVER) ? process.env.NODE_ENV !== "production" ? invariant(false, 'This store does not support Live Resolvers') : invariant(false) : void 0;
    var _evaluate = evaluate(),
      resolverResult = _evaluate.resolverResult,
      snapshot = _evaluate.snapshot,
      error = _evaluate.error;
    return [resolverResult, undefined, error, snapshot, undefined, undefined];
  };
  _proto.invalidateDataIDs = function invalidateDataIDs(updatedDataIDs) {};
  _proto.ensureClientRecord = function ensureClientRecord(id, typeName) {
    !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Client Edges to Client Objects are not supported in this version of Relay Store') : invariant(false) : void 0;
  };
  _proto.notifyUpdatedSubscribers = function notifyUpdatedSubscribers(updatedDataIDs) {};
  return NoopResolverCache;
}();
function addDependencyEdge(edges, from, to) {
  var set = edges.get(from);
  if (!set) {
    set = new Set();
    edges.set(from, set);
  }
  set.add(to);
}
var RecordResolverCache = /*#__PURE__*/function () {
  function RecordResolverCache(getRecordSource) {
    this._resolverIDToRecordIDs = new Map();
    this._recordIDToResolverIDs = new Map();
    this._getRecordSource = getRecordSource;
  }
  var _proto2 = RecordResolverCache.prototype;
  _proto2.readFromCacheOrEvaluate = function readFromCacheOrEvaluate(recordID, field, variables, evaluate, getDataForResolverFragment) {
    var recordSource = this._getRecordSource();
    var record = recordSource.get(recordID);
    !(record != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'We expect record to exist in the store.') : invariant(false) : void 0;
    var storageKey = getStorageKey(field, variables);
    var linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
    var linkedRecord = linkedID == null ? null : recordSource.get(linkedID);
    if (linkedRecord == null || this._isInvalid(linkedRecord, getDataForResolverFragment)) {
      var _linkedID;
      linkedID = (_linkedID = linkedID) !== null && _linkedID !== void 0 ? _linkedID : generateClientID(recordID, storageKey);
      linkedRecord = RelayModernRecord.create(linkedID, '__RELAY_RESOLVER__');
      var evaluationResult = evaluate();
      shallowFreeze(evaluationResult.resolverResult);
      RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_VALUE_KEY, evaluationResult.resolverResult);
      RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_SNAPSHOT_KEY, evaluationResult.snapshot);
      RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_ERROR_KEY, evaluationResult.error);
      recordSource.set(linkedID, linkedRecord);
      var currentRecord = recordSource.get(recordID);
      !(currentRecord != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected the parent record to still be in the record source.') : invariant(false) : void 0;
      var nextRecord = RelayModernRecord.clone(currentRecord);
      RelayModernRecord.setLinkedRecordID(nextRecord, storageKey, linkedID);
      recordSource.set(recordID, nextRecord);
      if (field.fragment != null) {
        var _evaluationResult$sna;
        var fragmentStorageKey = getStorageKey(field.fragment, variables);
        var resolverID = generateClientID(recordID, fragmentStorageKey);
        addDependencyEdge(this._resolverIDToRecordIDs, resolverID, linkedID);
        addDependencyEdge(this._recordIDToResolverIDs, recordID, resolverID);
        var seenRecordIds = (_evaluationResult$sna = evaluationResult.snapshot) === null || _evaluationResult$sna === void 0 ? void 0 : _evaluationResult$sna.seenRecords;
        if (seenRecordIds != null) {
          var _iterator = (0, _createForOfIteratorHelper2["default"])(seenRecordIds),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var seenRecordID = _step.value;
              addDependencyEdge(this._recordIDToResolverIDs, seenRecordID, resolverID);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    }
    var answer = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_VALUE_KEY);
    var snapshot = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_SNAPSHOT_KEY);
    var error = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_ERROR_KEY);
    return [answer, linkedID, error, snapshot, undefined, undefined];
  };
  _proto2.invalidateDataIDs = function invalidateDataIDs(updatedDataIDs) {
    var recordSource = this._getRecordSource();
    var visited = new Set();
    var recordsToVisit = Array.from(updatedDataIDs);
    while (recordsToVisit.length) {
      var recordID = recordsToVisit.pop();
      updatedDataIDs.add(recordID);
      var _iterator2 = (0, _createForOfIteratorHelper2["default"])((_this$_recordIDToReso = this._recordIDToResolverIDs.get(recordID)) !== null && _this$_recordIDToReso !== void 0 ? _this$_recordIDToReso : emptySet),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _this$_recordIDToReso;
          var fragment = _step2.value;
          if (!visited.has(fragment)) {
            var _iterator3 = (0, _createForOfIteratorHelper2["default"])((_this$_resolverIDToRe = this._resolverIDToRecordIDs.get(fragment)) !== null && _this$_resolverIDToRe !== void 0 ? _this$_resolverIDToRe : emptySet),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _this$_resolverIDToRe;
                var anotherRecordID = _step3.value;
                this._markInvalidatedResolverRecord(anotherRecordID, recordSource, updatedDataIDs);
                if (!visited.has(anotherRecordID)) {
                  recordsToVisit.push(anotherRecordID);
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  };
  _proto2._markInvalidatedResolverRecord = function _markInvalidatedResolverRecord(dataID, recordSource, updatedDataIDs) {
    var record = recordSource.get(dataID);
    if (!record) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Expected a resolver record with ID %s, but it was missing.', dataID) : void 0;
      return;
    }
    var nextRecord = RelayModernRecord.clone(record);
    RelayModernRecord.setValue(nextRecord, RELAY_RESOLVER_INVALIDATION_KEY, true);
    recordSource.set(dataID, nextRecord);
  };
  _proto2._isInvalid = function _isInvalid(record, getDataForResolverFragment) {
    if (!RelayModernRecord.getValue(record, RELAY_RESOLVER_INVALIDATION_KEY)) {
      return false;
    }
    var snapshot = RelayModernRecord.getValue(record, RELAY_RESOLVER_SNAPSHOT_KEY);
    var originalInputs = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data;
    var readerSelector = snapshot === null || snapshot === void 0 ? void 0 : snapshot.selector;
    if (originalInputs == null || readerSelector == null) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Expected previous inputs and reader selector on resolver record with ID %s, but they were missing.', RelayModernRecord.getDataID(record)) : void 0;
      return true;
    }
    var _getDataForResolverFr = getDataForResolverFragment(readerSelector),
      latestValues = _getDataForResolverFr.data;
    var recycled = recycleNodesInto(originalInputs, latestValues);
    if (recycled !== originalInputs) {
      return true;
    }
    if (RelayFeatureFlags.MARK_RESOLVER_VALUES_AS_CLEAN_AFTER_FRAGMENT_REREAD) {
      var nextRecord = RelayModernRecord.clone(record);
      RelayModernRecord.setValue(nextRecord, RELAY_RESOLVER_INVALIDATION_KEY, false);
      var recordSource = this._getRecordSource();
      recordSource.set(RelayModernRecord.getDataID(record), nextRecord);
    }
    return false;
  };
  _proto2.ensureClientRecord = function ensureClientRecord(id, typename) {
    !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Client Edges to Client Objects are not supported in this version of Relay Store') : invariant(false) : void 0;
  };
  _proto2.notifyUpdatedSubscribers = function notifyUpdatedSubscribers(updatedDataIDs) {
    !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Processing @outputType records is not supported in this version of Relay Store') : invariant(false) : void 0;
  };
  return RecordResolverCache;
}();
module.exports = {
  NoopResolverCache: NoopResolverCache,
  RecordResolverCache: RecordResolverCache
};