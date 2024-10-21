'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var recycleNodesInto = require('../../util/recycleNodesInto');
var _require = require('../../util/RelayConcreteNode'),
  RELAY_LIVE_RESOLVER = _require.RELAY_LIVE_RESOLVER;
var RelayFeatureFlags = require('../../util/RelayFeatureFlags');
var shallowFreeze = require('../../util/shallowFreeze');
var _require2 = require('../ClientID'),
  generateClientID = _require2.generateClientID,
  generateClientObjectClientID = _require2.generateClientObjectClientID;
var RelayModernRecord = require('../RelayModernRecord');
var _require3 = require('../RelayModernSelector'),
  createNormalizationSelector = _require3.createNormalizationSelector;
var RelayRecordSource = require('../RelayRecordSource');
var _require4 = require('../RelayResponseNormalizer'),
  normalize = _require4.normalize;
var _require5 = require('../RelayStoreUtils'),
  RELAY_RESOLVER_ERROR_KEY = _require5.RELAY_RESOLVER_ERROR_KEY,
  RELAY_RESOLVER_INVALIDATION_KEY = _require5.RELAY_RESOLVER_INVALIDATION_KEY,
  RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS = _require5.RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS,
  RELAY_RESOLVER_SNAPSHOT_KEY = _require5.RELAY_RESOLVER_SNAPSHOT_KEY,
  RELAY_RESOLVER_VALUE_KEY = _require5.RELAY_RESOLVER_VALUE_KEY,
  getStorageKey = _require5.getStorageKey;
var getOutputTypeRecordIDs = require('./getOutputTypeRecordIDs');
var isLiveStateValue = require('./isLiveStateValue');
var _require6 = require('./LiveResolverSuspenseSentinel'),
  isSuspenseSentinel = _require6.isSuspenseSentinel;
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
var RELAY_RESOLVER_LIVE_STATE_SUBSCRIPTION_KEY = '__resolverLiveStateSubscription';
var RELAY_RESOLVER_LIVE_STATE_VALUE = '__resolverLiveStateValue';
var RELAY_RESOLVER_LIVE_STATE_DIRTY = '__resolverLiveStateDirty';
var RELAY_RESOLVER_RECORD_TYPENAME = '__RELAY_RESOLVER__';
var MODEL_PROPERTY_NAME = '__relay_model_instance';
function addDependencyEdge(edges, from, to) {
  var set = edges.get(from);
  if (!set) {
    set = new Set();
    edges.set(from, set);
  }
  set.add(to);
}
var LiveResolverCache = /*#__PURE__*/function () {
  function LiveResolverCache(getRecordSource, store) {
    this._resolverIDToRecordIDs = new Map();
    this._recordIDToResolverIDs = new Map();
    this._getRecordSource = getRecordSource;
    this._store = store;
    this._handlingBatch = false;
    this._liveResolverBatchRecordSource = null;
  }
  var _proto = LiveResolverCache.prototype;
  _proto.readFromCacheOrEvaluate = function readFromCacheOrEvaluate(recordID, field, variables, evaluate, getDataForResolverFragment) {
    var recordSource = this._getRecordSource();
    var record = expectRecord(recordSource, recordID);
    var storageKey = getStorageKey(field, variables);
    var linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);
    var linkedRecord = linkedID == null ? null : recordSource.get(linkedID);
    var updatedDataIDs;
    if (linkedRecord == null || this._isInvalid(linkedRecord, getDataForResolverFragment)) {
      var _linkedID;
      if (linkedRecord != null) {
        maybeUnsubscribeFromLiveState(linkedRecord);
      }
      linkedID = (_linkedID = linkedID) !== null && _linkedID !== void 0 ? _linkedID : generateClientID(recordID, storageKey);
      linkedRecord = RelayModernRecord.create(linkedID, RELAY_RESOLVER_RECORD_TYPENAME);
      var evaluationResult = evaluate();
      RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_SNAPSHOT_KEY, evaluationResult.snapshot);
      RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_ERROR_KEY, evaluationResult.error);
      if (field.kind === RELAY_LIVE_RESOLVER) {
        if (evaluationResult.resolverResult != null) {
          if (process.env.NODE_ENV !== "production") {
            !isLiveStateValue(evaluationResult.resolverResult) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected the @live Relay Resolver backing the field "%s" to return a value ' + 'that implements LiveState. Did you mean to remove the @live annotation on this resolver?', field.path) : invariant(false) : void 0;
          }
          !(evaluationResult.error == null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Did not expect resolver to have both a value and an error.') : invariant(false) : void 0;
          var liveState = evaluationResult.resolverResult;
          updatedDataIDs = this._setLiveStateValue(linkedRecord, linkedID, liveState, field, variables);
        } else {
          if (process.env.NODE_ENV !== "production") {
            var _evaluationResult$sna;
            !(evaluationResult.error != null || ((_evaluationResult$sna = evaluationResult.snapshot) === null || _evaluationResult$sna === void 0 ? void 0 : _evaluationResult$sna.isMissingData)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected the @live Relay Resolver backing the field "%s" to return a value ' + 'that implements LiveState interface. The result for this field is `%s`, we also did not detect any errors, ' + 'or missing data during resolver execution. Did you mean to remove the @live annotation on this ' + 'resolver, or was there unexpected early return in the function?', field.path, String(evaluationResult.resolverResult)) : invariant(false) : void 0;
          }
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          !!isLiveStateValue(evaluationResult.resolverResult) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Unexpected LiveState value returned from the non-@live Relay Resolver backing the field "%s". Did you intend to add @live to this resolver?', field.path) : invariant(false) : void 0;
        }
        updatedDataIDs = this._setResolverValue(linkedRecord, evaluationResult.resolverResult, field, variables);
      }
      recordSource.set(linkedID, linkedRecord);
      var currentRecord = expectRecord(recordSource, recordID);
      var nextRecord = RelayModernRecord.clone(currentRecord);
      RelayModernRecord.setLinkedRecordID(nextRecord, storageKey, linkedID);
      recordSource.set(recordID, nextRecord);
      if (field.fragment != null) {
        var _evaluationResult$sna2;
        var fragmentStorageKey = getStorageKey(field.fragment, variables);
        var resolverID = generateClientID(recordID, fragmentStorageKey);
        addDependencyEdge(this._resolverIDToRecordIDs, resolverID, linkedID);
        addDependencyEdge(this._recordIDToResolverIDs, recordID, resolverID);
        var seenRecordIds = (_evaluationResult$sna2 = evaluationResult.snapshot) === null || _evaluationResult$sna2 === void 0 ? void 0 : _evaluationResult$sna2.seenRecords;
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
    } else if (field.kind === RELAY_LIVE_RESOLVER && RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_DIRTY)) {
      var _linkedID2;
      linkedID = (_linkedID2 = linkedID) !== null && _linkedID2 !== void 0 ? _linkedID2 : generateClientID(recordID, storageKey);
      linkedRecord = RelayModernRecord.clone(linkedRecord);
      var _liveState = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_VALUE);
      if (!isLiveStateValue(_liveState)) {
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'Unexpected LiveState value returned from Relay Resolver internal field `RELAY_RESOLVER_LIVE_STATE_VALUE`. ' + 'It is likely a bug in Relay, or a corrupt state of the relay store state ' + 'Field Path `%s`. Record `%s`.', field.path, JSON.stringify(linkedRecord)) : invariant(false) : void 0;
      }
      updatedDataIDs = this._setLiveResolverValue(linkedRecord, _liveState, field, variables);
      RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_DIRTY, false);
      recordSource.set(linkedID, linkedRecord);
    }
    var answer = this._getResolverValue(linkedRecord);
    var snapshot = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_SNAPSHOT_KEY);
    var error = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_ERROR_KEY);
    var suspenseID = null;
    if (isSuspenseSentinel(answer)) {
      var _linkedID3;
      suspenseID = (_linkedID3 = linkedID) !== null && _linkedID3 !== void 0 ? _linkedID3 : generateClientID(recordID, storageKey);
    }
    return [answer, linkedID, error, snapshot, suspenseID, updatedDataIDs];
  };
  _proto.getLiveResolverPromise = function getLiveResolverPromise(liveStateID) {
    var recordSource = this._getRecordSource();
    var liveStateRecord = recordSource.get(liveStateID);
    !(liveStateRecord != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected to find record for live resolver.') : invariant(false) : void 0;
    var liveState = RelayModernRecord.getValue(liveStateRecord, RELAY_RESOLVER_LIVE_STATE_VALUE);
    return new Promise(function (resolve) {
      var unsubscribe = liveState.subscribe(function () {
        unsubscribe();
        resolve();
      });
    });
  };
  _proto._setLiveStateValue = function _setLiveStateValue(linkedRecord, linkedID, liveState, field, variables) {
    var handler = this._makeLiveStateHandler(linkedID);
    var unsubscribe = liveState.subscribe(handler);
    RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_VALUE, liveState);
    var updatedDataIDs = this._setLiveResolverValue(linkedRecord, liveState, field, variables);
    RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_DIRTY, false);
    RelayModernRecord.setValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_SUBSCRIPTION_KEY, unsubscribe);
    return updatedDataIDs;
  };
  _proto._makeLiveStateHandler = function _makeLiveStateHandler(linkedID) {
    var _this = this;
    return function () {
      var currentSource = _this._getRecordSource();
      var currentRecord = currentSource.get(linkedID);
      if (!currentRecord) {
        return;
      }
      if (!RelayModernRecord.hasValue(currentRecord, RELAY_RESOLVER_LIVE_STATE_VALUE)) {
        process.env.NODE_ENV !== "production" ? warning(false, 'Unexpected callback for a incomplete live resolver record (__id: `%s`). The record has missing live state value. ' + 'This is a no-op and indicates a memory leak, and possible bug in Relay Live Resolvers. ' + 'Possible cause: The original record was GC-ed, or was created with the optimistic record source.' + ' Record details: `%s`.', linkedID, JSON.stringify(currentRecord)) : void 0;
        return;
      }
      var nextRecord = RelayModernRecord.clone(currentRecord);
      RelayModernRecord.setValue(nextRecord, RELAY_RESOLVER_LIVE_STATE_DIRTY, true);
      _this._setLiveResolverUpdate(linkedID, nextRecord);
    };
  };
  _proto._setLiveResolverUpdate = function _setLiveResolverUpdate(linkedId, record) {
    if (this._handlingBatch) {
      if (this._liveResolverBatchRecordSource == null) {
        this._liveResolverBatchRecordSource = RelayRecordSource.create();
      }
      this._liveResolverBatchRecordSource.set(linkedId, record);
    } else {
      var nextSource = RelayRecordSource.create();
      nextSource.set(linkedId, record);
      this._store.publish(nextSource);
      this._store.notify();
    }
  };
  _proto.batchLiveStateUpdates = function batchLiveStateUpdates(callback) {
    !!this._handlingBatch ? process.env.NODE_ENV !== "production" ? invariant(false, 'Unexpected nested call to batchLiveStateUpdates.') : invariant(false) : void 0;
    this._handlingBatch = true;
    try {
      callback();
    } finally {
      if (this._liveResolverBatchRecordSource != null) {
        this._store.publish(this._liveResolverBatchRecordSource);
        this._store.notify();
      }
      this._liveResolverBatchRecordSource = null;
      this._handlingBatch = false;
    }
  };
  _proto._setLiveResolverValue = function _setLiveResolverValue(resolverRecord, liveValue, field, variables) {
    var value = null;
    var resolverError = null;
    try {
      value = liveValue.read();
    } catch (e) {
      resolverError = e;
    }
    RelayModernRecord.setValue(resolverRecord, RELAY_RESOLVER_ERROR_KEY, resolverError);
    return this._setResolverValue(resolverRecord, value, field, variables);
  };
  _proto._setResolverValue = function _setResolverValue(resolverRecord, value, field, variables) {
    var normalizationInfo = field.normalizationInfo;
    var updatedDataIDs = null;
    if (value != null && normalizationInfo != null && !isSuspenseSentinel(value)) {
      var resolverValue;
      var prevOutputTypeRecordIDs = getOutputTypeRecordIDs(resolverRecord);
      var nextOutputTypeRecordIDs = new Set();
      var currentSource = this._getRecordSource();
      if (normalizationInfo.plural) {
        !Array.isArray(value) ? process.env.NODE_ENV !== "production" ? invariant(false, '_setResolverValue: Expected array value for plural @outputType resolver.') : invariant(false) : void 0;
        resolverValue = [];
        var nextSource = RelayRecordSource.create();
        for (var ii = 0; ii < value.length; ii++) {
          var currentValue = value[ii];
          if (currentValue == null) {
            continue;
          }
          !(typeof currentValue === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, '_setResolverValue: Expected object value as the payload for the @outputType resolver.') : invariant(false) : void 0;
          var typename = getConcreteTypename(normalizationInfo, currentValue);
          var outputTypeDataID = generateClientObjectClientID(typename, RelayModernRecord.getDataID(resolverRecord), ii);
          var source = this._normalizeOutputTypeValue(outputTypeDataID, currentValue, variables, normalizationInfo, [field.path, String(ii)], typename);
          var _iterator2 = (0, _createForOfIteratorHelper2["default"])(source.getRecordIDs()),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var recordID = _step2.value;
              nextSource.set(recordID, expectRecord(source, recordID));
              nextOutputTypeRecordIDs.add(recordID);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          resolverValue.push(outputTypeDataID);
        }
        updatedDataIDs = updateCurrentSource(currentSource, nextSource, prevOutputTypeRecordIDs);
      } else {
        !(typeof value === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, '_setResolverValue: Expected object value as the payload for the @outputType resolver.') : invariant(false) : void 0;
        var _typename = getConcreteTypename(normalizationInfo, value);
        var _outputTypeDataID = generateClientObjectClientID(_typename, RelayModernRecord.getDataID(resolverRecord));
        var _nextSource = this._normalizeOutputTypeValue(_outputTypeDataID, value, variables, normalizationInfo, [field.path], _typename);
        var _iterator3 = (0, _createForOfIteratorHelper2["default"])(_nextSource.getRecordIDs()),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _recordID = _step3.value;
            nextOutputTypeRecordIDs.add(_recordID);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        resolverValue = _outputTypeDataID;
        updatedDataIDs = updateCurrentSource(currentSource, _nextSource, prevOutputTypeRecordIDs);
      }
      RelayModernRecord.setValue(resolverRecord, RELAY_RESOLVER_OUTPUT_TYPE_RECORD_IDS, nextOutputTypeRecordIDs);
      shallowFreeze(resolverValue);
      RelayModernRecord.setValue(resolverRecord, RELAY_RESOLVER_VALUE_KEY, resolverValue);
    } else {
      shallowFreeze(value);
      RelayModernRecord.setValue(resolverRecord, RELAY_RESOLVER_VALUE_KEY, value);
    }
    return updatedDataIDs;
  };
  _proto.notifyUpdatedSubscribers = function notifyUpdatedSubscribers(updatedDataIDs) {
    this._store.__notifyUpdatedSubscribers(updatedDataIDs);
  };
  _proto._getResolverValue = function _getResolverValue(resolverRecord) {
    return RelayModernRecord.getValue(resolverRecord, RELAY_RESOLVER_VALUE_KEY);
  };
  _proto.invalidateDataIDs = function invalidateDataIDs(updatedDataIDs) {
    var recordSource = this._getRecordSource();
    var visited = new Set();
    var recordsToVisit = Array.from(updatedDataIDs);
    while (recordsToVisit.length) {
      var recordID = recordsToVisit.pop();
      updatedDataIDs.add(recordID);
      var fragmentSet = this._recordIDToResolverIDs.get(recordID);
      if (fragmentSet == null) {
        continue;
      }
      var _iterator4 = (0, _createForOfIteratorHelper2["default"])(fragmentSet),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var fragment = _step4.value;
          if (!visited.has(fragment)) {
            var recordSet = this._resolverIDToRecordIDs.get(fragment);
            if (recordSet == null) {
              continue;
            }
            var _iterator5 = (0, _createForOfIteratorHelper2["default"])(recordSet),
              _step5;
            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var anotherRecordID = _step5.value;
                markInvalidatedResolverRecord(anotherRecordID, recordSource);
                if (!visited.has(anotherRecordID)) {
                  recordsToVisit.push(anotherRecordID);
                }
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  };
  _proto._isInvalid = function _isInvalid(record, getDataForResolverFragment) {
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
  _proto._normalizeOutputTypeValue = function _normalizeOutputTypeValue(outputTypeDataID, value, variables, normalizationInfo, fieldPath, typename) {
    var source = RelayRecordSource.create();
    switch (normalizationInfo.kind) {
      case 'OutputType':
        {
          var record = RelayModernRecord.create(outputTypeDataID, typename);
          source.set(outputTypeDataID, record);
          var selector = createNormalizationSelector(normalizationInfo.normalizationNode, outputTypeDataID, variables);
          var normalizationOptions = this._store.__getNormalizationOptions(fieldPath);
          return normalize(source, selector, value, normalizationOptions).source;
        }
      case 'WeakModel':
        {
          var _record = RelayModernRecord.create(outputTypeDataID, typename);
          RelayModernRecord.setValue(_record, MODEL_PROPERTY_NAME, value);
          source.set(outputTypeDataID, _record);
          return source;
        }
      default:
        normalizationInfo.kind;
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'LiveResolverCache: Unexpected normalization info kind `%s`.', normalizationInfo.kind) : invariant(false) : void 0;
    }
  };
  _proto.ensureClientRecord = function ensureClientRecord(id, typeName) {
    var key = generateClientObjectClientID(typeName, id);
    var recordSource = this._getRecordSource();
    if (!recordSource.has(key)) {
      var newRecord = RelayModernRecord.create(key, typeName);
      RelayModernRecord.setValue(newRecord, 'id', id);
      recordSource.set(key, newRecord);
    }
    return key;
  };
  _proto.unsubscribeFromLiveResolverRecords = function unsubscribeFromLiveResolverRecords(invalidatedDataIDs) {
    return unsubscribeFromLiveResolverRecordsImpl(this._getRecordSource(), invalidatedDataIDs);
  };
  _proto.invalidateResolverRecords = function invalidateResolverRecords(invalidatedDataIDs) {
    if (invalidatedDataIDs.size === 0) {
      return;
    }
    var _iterator6 = (0, _createForOfIteratorHelper2["default"])(invalidatedDataIDs),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var dataID = _step6.value;
        var record = this._getRecordSource().get(dataID);
        if (record != null && isResolverRecord(record)) {
          this._getRecordSource()["delete"](dataID);
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
  };
  return LiveResolverCache;
}();
function updateCurrentSource(currentSource, nextSource, prevOutputTypeRecordIDs) {
  var updatedDataIDs = new Set();
  if (prevOutputTypeRecordIDs != null) {
    var _iterator7 = (0, _createForOfIteratorHelper2["default"])(prevOutputTypeRecordIDs),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var recordID = _step7.value;
        if (!nextSource.has(recordID)) {
          updatedDataIDs.add(recordID);
          currentSource.remove(recordID);
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  }
  var _iterator8 = (0, _createForOfIteratorHelper2["default"])(nextSource.getRecordIDs()),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var _recordID2 = _step8.value;
      var nextRecord = expectRecord(nextSource, _recordID2);
      if (currentSource.has(_recordID2)) {
        var currentRecord = expectRecord(currentSource, _recordID2);
        var updatedRecord = RelayModernRecord.update(currentRecord, nextRecord);
        if (updatedRecord !== currentRecord) {
          updatedDataIDs.add(_recordID2);
          currentSource.set(_recordID2, updatedRecord);
          markInvalidatedLinkedResolverRecords(currentRecord, currentSource);
        }
      } else {
        currentSource.set(_recordID2, nextRecord);
      }
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  return updatedDataIDs;
}
function getAllLinkedRecordIds(record) {
  var linkedRecordIDs = new Set();
  RelayModernRecord.getFields(record).forEach(function (field) {
    if (RelayModernRecord.hasLinkedRecordID(record, field)) {
      var linkedRecordID = RelayModernRecord.getLinkedRecordID(record, field);
      if (linkedRecordID != null) {
        linkedRecordIDs.add(linkedRecordID);
      }
    } else if (RelayModernRecord.hasLinkedRecordIDs(record, field)) {
      var _RelayModernRecord$ge;
      (_RelayModernRecord$ge = RelayModernRecord.getLinkedRecordIDs(record, field)) === null || _RelayModernRecord$ge === void 0 ? void 0 : _RelayModernRecord$ge.forEach(function (linkedRecordID) {
        if (linkedRecordID != null) {
          linkedRecordIDs.add(linkedRecordID);
        }
      });
    }
  });
  return linkedRecordIDs;
}
function markInvalidatedResolverRecord(dataID, recordSource) {
  var record = recordSource.get(dataID);
  if (!record) {
    process.env.NODE_ENV !== "production" ? warning(false, 'Expected a resolver record with ID %s, but it was missing.', dataID) : void 0;
    return;
  }
  var nextRecord = RelayModernRecord.clone(record);
  RelayModernRecord.setValue(nextRecord, RELAY_RESOLVER_INVALIDATION_KEY, true);
  recordSource.set(dataID, nextRecord);
}
function markInvalidatedLinkedResolverRecords(record, recordSource) {
  var currentLinkedDataIDs = getAllLinkedRecordIds(record);
  var _iterator9 = (0, _createForOfIteratorHelper2["default"])(currentLinkedDataIDs),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var recordID = _step9.value;
      var _record2 = recordSource.get(recordID);
      if (_record2 != null && isResolverRecord(_record2)) {
        markInvalidatedResolverRecord(recordID, recordSource);
      }
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
}
function unsubscribeFromLiveResolverRecordsImpl(recordSource, invalidatedDataIDs) {
  if (invalidatedDataIDs.size === 0) {
    return;
  }
  var _iterator10 = (0, _createForOfIteratorHelper2["default"])(invalidatedDataIDs),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var dataID = _step10.value;
      var record = recordSource.get(dataID);
      if (record != null && isResolverRecord(record)) {
        maybeUnsubscribeFromLiveState(record);
      }
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
}
function isResolverRecord(record) {
  return RelayModernRecord.getType(record) === RELAY_RESOLVER_RECORD_TYPENAME;
}
function maybeUnsubscribeFromLiveState(linkedRecord) {
  var previousUnsubscribe = RelayModernRecord.getValue(linkedRecord, RELAY_RESOLVER_LIVE_STATE_SUBSCRIPTION_KEY);
  if (previousUnsubscribe != null) {
    previousUnsubscribe();
  }
}
function expectRecord(source, recordID) {
  var record = source.get(recordID);
  !(record != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected a record with ID `%s` to exist in the record source.', recordID) : invariant(false) : void 0;
  return record;
}
function getUpdatedDataIDs(updatedRecords) {
  return updatedRecords;
}
function getConcreteTypename(normalizationInfo, currentValue) {
  var _normalizationInfo$co;
  var typename = (_normalizationInfo$co = normalizationInfo.concreteType) !== null && _normalizationInfo$co !== void 0 ? _normalizationInfo$co : currentValue.__typename;
  !(typename != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'normalizationInfo.concreteType should not be null, or the value returned from the resolver should include a __typename field, ' + 'or the resolver should have a flow error. If not, this indicates a bug in Relay.') : invariant(false) : void 0;
  return typename;
}
module.exports = {
  LiveResolverCache: LiveResolverCache,
  getUpdatedDataIDs: getUpdatedDataIDs,
  RELAY_RESOLVER_LIVE_STATE_SUBSCRIPTION_KEY: RELAY_RESOLVER_LIVE_STATE_SUBSCRIPTION_KEY
};