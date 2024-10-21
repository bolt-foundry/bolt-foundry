'use strict';

var _global$ErrorUtils$ap, _global$ErrorUtils;
var RelayRecordSourceMutator = require('../mutations/RelayRecordSourceMutator');
var RelayRecordSourceProxy = require('../mutations/RelayRecordSourceProxy');
var RelayRecordSourceSelectorProxy = require('../mutations/RelayRecordSourceSelectorProxy');
var RelayReader = require('./RelayReader');
var RelayRecordSource = require('./RelayRecordSource');
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
var _global = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : undefined;
var applyWithGuard = (_global$ErrorUtils$ap = _global === null || _global === void 0 ? void 0 : (_global$ErrorUtils = _global.ErrorUtils) === null || _global$ErrorUtils === void 0 ? void 0 : _global$ErrorUtils.applyWithGuard) !== null && _global$ErrorUtils$ap !== void 0 ? _global$ErrorUtils$ap : function (callback, context, args, onError, name) {
  return callback.apply(context, args);
};
var RelayPublishQueue = /*#__PURE__*/function () {
  function RelayPublishQueue(store, handlerProvider, getDataID, missingFieldHandlers) {
    this._hasStoreSnapshot = false;
    this._handlerProvider = handlerProvider || null;
    this._pendingBackupRebase = false;
    this._pendingData = new Set();
    this._pendingOptimisticUpdates = new Set();
    this._store = store;
    this._appliedOptimisticUpdates = new Set();
    this._gcHold = null;
    this._getDataID = getDataID;
    this._missingFieldHandlers = missingFieldHandlers;
  }
  var _proto = RelayPublishQueue.prototype;
  _proto.applyUpdate = function applyUpdate(updater) {
    !(!this._appliedOptimisticUpdates.has(updater) && !this._pendingOptimisticUpdates.has(updater)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayPublishQueue: Cannot apply the same update function more than ' + 'once concurrently.') : invariant(false) : void 0;
    this._pendingOptimisticUpdates.add(updater);
  };
  _proto.revertUpdate = function revertUpdate(updater) {
    if (this._pendingOptimisticUpdates.has(updater)) {
      this._pendingOptimisticUpdates["delete"](updater);
    } else if (this._appliedOptimisticUpdates.has(updater)) {
      this._pendingBackupRebase = true;
      this._appliedOptimisticUpdates["delete"](updater);
    }
  };
  _proto.revertAll = function revertAll() {
    this._pendingBackupRebase = true;
    this._pendingOptimisticUpdates.clear();
    this._appliedOptimisticUpdates.clear();
  };
  _proto.commitPayload = function commitPayload(operation, payload, updater) {
    this._pendingBackupRebase = true;
    this._pendingData.add({
      kind: 'payload',
      operation: operation,
      payload: payload,
      updater: updater
    });
  };
  _proto.commitUpdate = function commitUpdate(updater) {
    this._pendingBackupRebase = true;
    this._pendingData.add({
      kind: 'updater',
      updater: updater
    });
  };
  _proto.commitSource = function commitSource(source) {
    this._pendingBackupRebase = true;
    this._pendingData.add({
      kind: 'source',
      source: source
    });
  };
  _proto.run = function run(sourceOperation) {
    var runWillClearGcHold = this._appliedOptimisticUpdates === 0 && !!this._gcHold;
    var runIsANoop = !this._pendingBackupRebase && this._pendingOptimisticUpdates.size === 0 && !runWillClearGcHold;
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning(!runIsANoop, 'RelayPublishQueue.run was called, but the call would have been a noop.') : void 0;
      process.env.NODE_ENV !== "production" ? warning(this._isRunning !== true, 'A store update was detected within another store update. Please ' + "make sure new store updates aren't being executed within an " + 'updater function for a different update.') : void 0;
      this._isRunning = true;
    }
    if (runIsANoop) {
      if (process.env.NODE_ENV !== "production") {
        this._isRunning = false;
      }
      return [];
    }
    if (this._pendingBackupRebase) {
      if (this._hasStoreSnapshot) {
        this._store.restore();
        this._hasStoreSnapshot = false;
      }
    }
    var invalidatedStore = this._commitData();
    if (this._pendingOptimisticUpdates.size || this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
      if (!this._hasStoreSnapshot) {
        this._store.snapshot();
        this._hasStoreSnapshot = true;
      }
      this._applyUpdates();
    }
    this._pendingBackupRebase = false;
    if (this._appliedOptimisticUpdates.size > 0) {
      if (!this._gcHold) {
        this._gcHold = this._store.holdGC();
      }
    } else {
      if (this._gcHold) {
        this._gcHold.dispose();
        this._gcHold = null;
      }
    }
    if (process.env.NODE_ENV !== "production") {
      this._isRunning = false;
    }
    return this._store.notify(sourceOperation, invalidatedStore);
  };
  _proto._publishSourceFromPayload = function _publishSourceFromPayload(pendingPayload) {
    var _this = this;
    var payload = pendingPayload.payload,
      operation = pendingPayload.operation,
      updater = pendingPayload.updater;
    var source = payload.source,
      fieldPayloads = payload.fieldPayloads;
    var mutator = new RelayRecordSourceMutator(this._store.getSource(), source);
    var recordSourceProxy = new RelayRecordSourceProxy(mutator, this._getDataID, this._handlerProvider, this._missingFieldHandlers);
    if (fieldPayloads && fieldPayloads.length) {
      fieldPayloads.forEach(function (fieldPayload) {
        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
        !handler ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernEnvironment: Expected a handler to be provided for ' + 'handle `%s`.', fieldPayload.handle) : invariant(false) : void 0;
        handler.update(recordSourceProxy, fieldPayload);
      });
    }
    if (updater) {
      var selector = operation.fragment;
      !(selector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernEnvironment: Expected a selector to be provided with updater function.') : invariant(false) : void 0;
      var recordSourceSelectorProxy = new RelayRecordSourceSelectorProxy(mutator, recordSourceProxy, selector, this._missingFieldHandlers);
      var selectorData = lookupSelector(source, selector);
      updater(recordSourceSelectorProxy, selectorData);
    }
    var idsMarkedForInvalidation = recordSourceProxy.getIDsMarkedForInvalidation();
    this._store.publish(source, idsMarkedForInvalidation);
    return recordSourceProxy.isStoreMarkedForInvalidation();
  };
  _proto._commitData = function _commitData() {
    var _this2 = this;
    if (!this._pendingData.size) {
      return false;
    }
    var invalidatedStore = false;
    this._pendingData.forEach(function (data) {
      if (data.kind === 'payload') {
        var payloadInvalidatedStore = _this2._publishSourceFromPayload(data);
        invalidatedStore = invalidatedStore || payloadInvalidatedStore;
      } else if (data.kind === 'source') {
        var source = data.source;
        _this2._store.publish(source);
      } else {
        var updater = data.updater;
        var sink = RelayRecordSource.create();
        var mutator = new RelayRecordSourceMutator(_this2._store.getSource(), sink);
        var recordSourceProxy = new RelayRecordSourceProxy(mutator, _this2._getDataID, _this2._handlerProvider, _this2._missingFieldHandlers);
        applyWithGuard(updater, null, [recordSourceProxy], null, 'RelayPublishQueue:commitData');
        invalidatedStore = invalidatedStore || recordSourceProxy.isStoreMarkedForInvalidation();
        var idsMarkedForInvalidation = recordSourceProxy.getIDsMarkedForInvalidation();
        _this2._store.publish(sink, idsMarkedForInvalidation);
      }
    });
    this._pendingData.clear();
    return invalidatedStore;
  };
  _proto._applyUpdates = function _applyUpdates() {
    var _this3 = this;
    var sink = RelayRecordSource.create();
    var mutator = new RelayRecordSourceMutator(this._store.getSource(), sink);
    var recordSourceProxy = new RelayRecordSourceProxy(mutator, this._getDataID, this._handlerProvider, this._missingFieldHandlers);
    var processUpdate = function processUpdate(optimisticUpdate) {
      if (optimisticUpdate.storeUpdater) {
        var storeUpdater = optimisticUpdate.storeUpdater;
        applyWithGuard(storeUpdater, null, [recordSourceProxy], null, 'RelayPublishQueue:applyUpdates');
      } else {
        var operation = optimisticUpdate.operation,
          payload = optimisticUpdate.payload,
          updater = optimisticUpdate.updater;
        var source = payload.source,
          fieldPayloads = payload.fieldPayloads;
        if (source) {
          recordSourceProxy.publishSource(source, fieldPayloads);
        }
        if (updater) {
          var selectorData;
          if (source) {
            selectorData = lookupSelector(source, operation.fragment);
          }
          var recordSourceSelectorProxy = new RelayRecordSourceSelectorProxy(mutator, recordSourceProxy, operation.fragment, _this3._missingFieldHandlers);
          applyWithGuard(updater, null, [recordSourceSelectorProxy, selectorData], null, 'RelayPublishQueue:applyUpdates');
        }
      }
    };
    if (this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
      this._appliedOptimisticUpdates.forEach(processUpdate);
    }
    if (this._pendingOptimisticUpdates.size) {
      this._pendingOptimisticUpdates.forEach(function (optimisticUpdate) {
        processUpdate(optimisticUpdate);
        _this3._appliedOptimisticUpdates.add(optimisticUpdate);
      });
      this._pendingOptimisticUpdates.clear();
    }
    this._store.publish(sink);
  };
  return RelayPublishQueue;
}();
function lookupSelector(source, selector) {
  var selectorData = RelayReader.read(source, selector).data;
  if (process.env.NODE_ENV !== "production") {
    var deepFreeze = require('../util/deepFreeze');
    if (selectorData) {
      deepFreeze(selectorData);
    }
  }
  return selectorData;
}
module.exports = RelayPublishQueue;