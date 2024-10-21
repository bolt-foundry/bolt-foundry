'use strict';

var deepFreeze = require('../util/deepFreeze');
var recycleNodesInto = require('../util/recycleNodesInto');
var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var hasOverlappingIDs = require('./hasOverlappingIDs');
var hasSignificantOverlappingIDs = require('./hasSignificantOverlappingIDs');
var RelayReader = require('./RelayReader');
var RelayStoreSubscriptions = /*#__PURE__*/function () {
  function RelayStoreSubscriptions(log, resolverCache) {
    this._subscriptions = new Set();
    this.__log = log;
    this._resolverCache = resolverCache;
  }
  var _proto = RelayStoreSubscriptions.prototype;
  _proto.subscribe = function subscribe(snapshot, callback) {
    var _this = this;
    var subscription = {
      backup: null,
      callback: callback,
      snapshot: snapshot,
      stale: false
    };
    var dispose = function dispose() {
      _this._subscriptions["delete"](subscription);
    };
    this._subscriptions.add(subscription);
    return {
      dispose: dispose
    };
  };
  _proto.snapshotSubscriptions = function snapshotSubscriptions(source) {
    var _this2 = this;
    this._subscriptions.forEach(function (subscription) {
      if (!subscription.stale) {
        subscription.backup = subscription.snapshot;
        return;
      }
      var snapshot = subscription.snapshot;
      var backup = RelayReader.read(source, snapshot.selector, _this2._resolverCache);
      var nextData = recycleNodesInto(snapshot.data, backup.data);
      backup.data = nextData;
      subscription.backup = backup;
    });
  };
  _proto.restoreSubscriptions = function restoreSubscriptions() {
    this._subscriptions.forEach(function (subscription) {
      var backup = subscription.backup;
      subscription.backup = null;
      if (backup) {
        if (backup.data !== subscription.snapshot.data) {
          subscription.stale = true;
        }
        subscription.snapshot = {
          data: subscription.snapshot.data,
          isMissingData: backup.isMissingData,
          missingClientEdges: backup.missingClientEdges,
          missingLiveResolverFields: backup.missingLiveResolverFields,
          seenRecords: backup.seenRecords,
          selector: backup.selector,
          missingRequiredFields: backup.missingRequiredFields,
          relayResolverErrors: backup.relayResolverErrors,
          errorResponseFields: backup.errorResponseFields
        };
      } else {
        subscription.stale = true;
      }
    });
  };
  _proto.updateSubscriptions = function updateSubscriptions(source, updatedRecordIDs, updatedOwners, sourceOperation) {
    var _this3 = this;
    var hasUpdatedRecords = updatedRecordIDs.size !== 0;
    this._subscriptions.forEach(function (subscription) {
      var owner = _this3._updateSubscription(source, subscription, updatedRecordIDs, hasUpdatedRecords, sourceOperation);
      if (owner != null) {
        updatedOwners.push(owner);
      }
    });
  };
  _proto._updateSubscription = function _updateSubscription(source, subscription, updatedRecordIDs, hasUpdatedRecords, sourceOperation) {
    var backup = subscription.backup,
      callback = subscription.callback,
      snapshot = subscription.snapshot,
      stale = subscription.stale;
    var hasOverlappingUpdates = hasUpdatedRecords && hasOverlappingIDs(snapshot.seenRecords, updatedRecordIDs);
    if (!stale && !hasOverlappingUpdates) {
      return;
    }
    var nextSnapshot = hasOverlappingUpdates || !backup ? RelayReader.read(source, snapshot.selector, this._resolverCache) : backup;
    var nextData = recycleNodesInto(snapshot.data, nextSnapshot.data);
    nextSnapshot = {
      data: nextData,
      isMissingData: nextSnapshot.isMissingData,
      missingClientEdges: nextSnapshot.missingClientEdges,
      missingLiveResolverFields: nextSnapshot.missingLiveResolverFields,
      seenRecords: nextSnapshot.seenRecords,
      selector: nextSnapshot.selector,
      missingRequiredFields: nextSnapshot.missingRequiredFields,
      relayResolverErrors: nextSnapshot.relayResolverErrors,
      errorResponseFields: nextSnapshot.errorResponseFields
    };
    if (process.env.NODE_ENV !== "production") {
      deepFreeze(nextSnapshot);
    }
    subscription.snapshot = nextSnapshot;
    subscription.stale = false;
    if (nextSnapshot.data !== snapshot.data) {
      if (this.__log && RelayFeatureFlags.ENABLE_NOTIFY_SUBSCRIPTION) {
        this.__log({
          name: 'store.notify.subscription',
          sourceOperation: sourceOperation,
          snapshot: snapshot,
          nextSnapshot: nextSnapshot
        });
      }
      callback(nextSnapshot);
      return snapshot.selector.owner;
    }
    if (RelayFeatureFlags.ENABLE_LOOSE_SUBSCRIPTION_ATTRIBUTION && (stale || hasSignificantOverlappingIDs(snapshot.seenRecords, updatedRecordIDs))) {
      return snapshot.selector.owner;
    }
  };
  return RelayStoreSubscriptions;
}();
module.exports = RelayStoreSubscriptions;