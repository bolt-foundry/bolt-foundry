'use strict';

var wrapNetworkWithLogObserver = require('../network/wrapNetworkWithLogObserver');
var defaultGetDataID = require('../store/defaultGetDataID');
var RelayOperationTracker = require('../store/RelayOperationTracker');
var RelayPublishQueue = require('../store/RelayPublishQueue');
var registerEnvironmentWithDevTools = require('../util/registerEnvironmentWithDevTools');
var ActorSpecificEnvironment = /*#__PURE__*/function () {
  function ActorSpecificEnvironment(config) {
    var _this = this;
    this.configName = config.configName;
    this.actorIdentifier = config.actorIdentifier;
    this.multiActorEnvironment = config.multiActorEnvironment;
    this.__log = config.logFn;
    this.relayFieldLogger = config.relayFieldLogger;
    this._operationTracker = new RelayOperationTracker();
    this._store = config.store;
    this._network = wrapNetworkWithLogObserver(this, config.network);
    this._publishQueue = new RelayPublishQueue(config.store, config.handlerProvider, defaultGetDataID, config.missingFieldHandlers);
    this._defaultRenderPolicy = config.defaultRenderPolicy;
    this.options = {
      actorID: this.actorIdentifier
    };
    this['@@RelayModernEnvironment'] = true;
    if (process.env.NODE_ENV !== "production") {
      var _require = require('../store/StoreInspector'),
        inspect = _require.inspect;
      this.DEBUG_inspect = function (dataID) {
        return inspect(_this, dataID);
      };
    }
    registerEnvironmentWithDevTools(this);
  }
  var _proto = ActorSpecificEnvironment.prototype;
  _proto.getPublishQueue = function getPublishQueue() {
    return this._publishQueue;
  };
  _proto.UNSTABLE_getDefaultRenderPolicy = function UNSTABLE_getDefaultRenderPolicy() {
    return this._defaultRenderPolicy;
  };
  _proto.applyMutation = function applyMutation(optimisticConfig) {
    return this.multiActorEnvironment.applyMutation(this, optimisticConfig);
  };
  _proto.applyUpdate = function applyUpdate(optimisticUpdate) {
    return this.multiActorEnvironment.applyUpdate(this, optimisticUpdate);
  };
  _proto.revertUpdate = function revertUpdate(optimisticUpdate) {
    return this.multiActorEnvironment.revertUpdate(this, optimisticUpdate);
  };
  _proto.replaceUpdate = function replaceUpdate(optimisticUpdate, replacementUpdate) {
    return this.multiActorEnvironment.replaceUpdate(this, optimisticUpdate, replacementUpdate);
  };
  _proto.check = function check(operation) {
    return this.multiActorEnvironment.check(this, operation);
  };
  _proto.subscribe = function subscribe(snapshot, callback) {
    return this.multiActorEnvironment.subscribe(this, snapshot, callback);
  };
  _proto.retain = function retain(operation) {
    return this.multiActorEnvironment.retain(this, operation);
  };
  _proto.commitUpdate = function commitUpdate(updater) {
    return this.multiActorEnvironment.commitUpdate(this, updater);
  };
  _proto.commitPayload = function commitPayload(operationDescriptor, payload) {
    return this.multiActorEnvironment.commitPayload(this, operationDescriptor, payload);
  };
  _proto.getNetwork = function getNetwork() {
    return this._network;
  };
  _proto.getStore = function getStore() {
    return this._store;
  };
  _proto.getOperationTracker = function getOperationTracker() {
    return this._operationTracker;
  };
  _proto.getScheduler = function getScheduler() {
    return this.multiActorEnvironment.getScheduler();
  };
  _proto.lookup = function lookup(selector) {
    return this.multiActorEnvironment.lookup(this, selector);
  };
  _proto.execute = function execute(config) {
    return this.multiActorEnvironment.execute(this, config);
  };
  _proto.executeSubscription = function executeSubscription(config) {
    return this.multiActorEnvironment.executeSubscription(this, config);
  };
  _proto.executeMutation = function executeMutation(options) {
    return this.multiActorEnvironment.executeMutation(this, options);
  };
  _proto.executeWithSource = function executeWithSource(options) {
    return this.multiActorEnvironment.executeWithSource(this, options);
  };
  _proto.isRequestActive = function isRequestActive(requestIdentifier) {
    return this.multiActorEnvironment.isRequestActive(this, requestIdentifier);
  };
  _proto.isServer = function isServer() {
    return this.multiActorEnvironment.isServer();
  };
  return ActorSpecificEnvironment;
}();
module.exports = ActorSpecificEnvironment;