'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var RelayDefaultHandlerProvider = require('../handlers/RelayDefaultHandlerProvider');
var _require = require('../multi-actor-environment/ActorIdentifier'),
  INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE = _require.INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE,
  assertInternalActorIdentifier = _require.assertInternalActorIdentifier;
var RelayObservable = require('../network/RelayObservable');
var wrapNetworkWithLogObserver = require('../network/wrapNetworkWithLogObserver');
var RelayOperationTracker = require('../store/RelayOperationTracker');
var registerEnvironmentWithDevTools = require('../util/registerEnvironmentWithDevTools');
var defaultGetDataID = require('./defaultGetDataID');
var defaultRelayFieldLogger = require('./defaultRelayFieldLogger');
var normalizeResponse = require('./normalizeResponse');
var OperationExecutor = require('./OperationExecutor');
var RelayPublishQueue = require('./RelayPublishQueue');
var RelayRecordSource = require('./RelayRecordSource');
var invariant = require('invariant');
var RelayModernEnvironment = /*#__PURE__*/function () {
  function RelayModernEnvironment(config) {
    var _this = this;
    var _config$log, _config$relayFieldLog, _config$UNSTABLE_defa, _config$getDataID, _config$missingFieldH, _config$handlerProvid, _config$scheduler, _config$isServer, _config$normalizeResp, _config$operationTrac;
    this.configName = config.configName;
    this._treatMissingFieldsAsNull = config.treatMissingFieldsAsNull === true;
    var operationLoader = config.operationLoader;
    if (process.env.NODE_ENV !== "production") {
      if (operationLoader != null) {
        !(typeof operationLoader === 'object' && typeof operationLoader.get === 'function' && typeof operationLoader.load === 'function') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayModernEnvironment: Expected `operationLoader` to be an object ' + 'with get() and load() functions, got `%s`.', operationLoader) : invariant(false) : void 0;
      }
    }
    this.__log = (_config$log = config.log) !== null && _config$log !== void 0 ? _config$log : emptyFunction;
    this.relayFieldLogger = (_config$relayFieldLog = config.relayFieldLogger) !== null && _config$relayFieldLog !== void 0 ? _config$relayFieldLog : defaultRelayFieldLogger;
    this._defaultRenderPolicy = (_config$UNSTABLE_defa = config.UNSTABLE_defaultRenderPolicy) !== null && _config$UNSTABLE_defa !== void 0 ? _config$UNSTABLE_defa : 'partial';
    this._operationLoader = operationLoader;
    this._operationExecutions = new Map();
    this._network = wrapNetworkWithLogObserver(this, config.network);
    this._getDataID = (_config$getDataID = config.getDataID) !== null && _config$getDataID !== void 0 ? _config$getDataID : defaultGetDataID;
    this._missingFieldHandlers = (_config$missingFieldH = config.missingFieldHandlers) !== null && _config$missingFieldH !== void 0 ? _config$missingFieldH : [];
    this._publishQueue = new RelayPublishQueue(config.store, (_config$handlerProvid = config.handlerProvider) !== null && _config$handlerProvid !== void 0 ? _config$handlerProvid : RelayDefaultHandlerProvider, this._getDataID, this._missingFieldHandlers);
    this._scheduler = (_config$scheduler = config.scheduler) !== null && _config$scheduler !== void 0 ? _config$scheduler : null;
    this._store = config.store;
    this.options = config.options;
    this._isServer = (_config$isServer = config.isServer) !== null && _config$isServer !== void 0 ? _config$isServer : false;
    this._normalizeResponse = (_config$normalizeResp = config.normalizeResponse) !== null && _config$normalizeResp !== void 0 ? _config$normalizeResp : normalizeResponse;
    this.__setNet = function (newNet) {
      return _this._network = wrapNetworkWithLogObserver(_this, newNet);
    };
    if (process.env.NODE_ENV !== "production") {
      var _require2 = require('./StoreInspector'),
        inspect = _require2.inspect;
      this.DEBUG_inspect = function (dataID) {
        return inspect(_this, dataID);
      };
    }
    this._operationTracker = (_config$operationTrac = config.operationTracker) !== null && _config$operationTrac !== void 0 ? _config$operationTrac : new RelayOperationTracker();
    this._shouldProcessClientComponents = config.shouldProcessClientComponents;
    registerEnvironmentWithDevTools(this);
  }
  var _proto = RelayModernEnvironment.prototype;
  _proto.getStore = function getStore() {
    return this._store;
  };
  _proto.getNetwork = function getNetwork() {
    return this._network;
  };
  _proto.getOperationTracker = function getOperationTracker() {
    return this._operationTracker;
  };
  _proto.getScheduler = function getScheduler() {
    return this._scheduler;
  };
  _proto.isRequestActive = function isRequestActive(requestIdentifier) {
    var activeState = this._operationExecutions.get(requestIdentifier);
    return activeState === 'active';
  };
  _proto.UNSTABLE_getDefaultRenderPolicy = function UNSTABLE_getDefaultRenderPolicy() {
    return this._defaultRenderPolicy;
  };
  _proto.applyUpdate = function applyUpdate(optimisticUpdate) {
    var _this2 = this;
    var dispose = function dispose() {
      _this2._scheduleUpdates(function () {
        _this2._publishQueue.revertUpdate(optimisticUpdate);
        _this2._publishQueue.run();
      });
    };
    this._scheduleUpdates(function () {
      _this2._publishQueue.applyUpdate(optimisticUpdate);
      _this2._publishQueue.run();
    });
    return {
      dispose: dispose
    };
  };
  _proto.revertUpdate = function revertUpdate(update) {
    var _this3 = this;
    this._scheduleUpdates(function () {
      _this3._publishQueue.revertUpdate(update);
      _this3._publishQueue.run();
    });
  };
  _proto.replaceUpdate = function replaceUpdate(update, newUpdate) {
    var _this4 = this;
    this._scheduleUpdates(function () {
      _this4._publishQueue.revertUpdate(update);
      _this4._publishQueue.applyUpdate(newUpdate);
      _this4._publishQueue.run();
    });
  };
  _proto.applyMutation = function applyMutation(optimisticConfig) {
    var subscription = this._execute({
      createSource: function createSource() {
        return RelayObservable.create(function (_sink) {});
      },
      isClientPayload: false,
      operation: optimisticConfig.operation,
      optimisticConfig: optimisticConfig,
      updater: null
    }).subscribe({});
    return {
      dispose: function dispose() {
        return subscription.unsubscribe();
      }
    };
  };
  _proto.check = function check(operation) {
    if (this._missingFieldHandlers.length === 0 && !operationHasClientAbstractTypes(operation)) {
      return this._store.check(operation);
    }
    return this._checkSelectorAndHandleMissingFields(operation, this._missingFieldHandlers);
  };
  _proto.commitPayload = function commitPayload(operation, payload) {
    this._execute({
      createSource: function createSource() {
        return RelayObservable.from({
          data: payload
        });
      },
      isClientPayload: true,
      operation: operation,
      optimisticConfig: null,
      updater: null
    }).subscribe({});
  };
  _proto.commitUpdate = function commitUpdate(updater) {
    var _this5 = this;
    this._scheduleUpdates(function () {
      _this5._publishQueue.commitUpdate(updater);
      _this5._publishQueue.run();
    });
  };
  _proto.lookup = function lookup(readSelector) {
    return this._store.lookup(readSelector);
  };
  _proto.subscribe = function subscribe(snapshot, callback) {
    return this._store.subscribe(snapshot, callback);
  };
  _proto.retain = function retain(operation) {
    return this._store.retain(operation);
  };
  _proto.isServer = function isServer() {
    return this._isServer;
  };
  _proto._checkSelectorAndHandleMissingFields = function _checkSelectorAndHandleMissingFields(operation, handlers) {
    var _this6 = this;
    var target = RelayRecordSource.create();
    var source = this._store.getSource();
    var result = this._store.check(operation, {
      handlers: handlers,
      defaultActorIdentifier: INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE,
      getSourceForActor: function getSourceForActor(actorIdentifier) {
        assertInternalActorIdentifier(actorIdentifier);
        return source;
      },
      getTargetForActor: function getTargetForActor(actorIdentifier) {
        assertInternalActorIdentifier(actorIdentifier);
        return target;
      }
    });
    if (target.size() > 0) {
      this._scheduleUpdates(function () {
        _this6._publishQueue.commitSource(target);
        _this6._publishQueue.run();
      });
    }
    return result;
  };
  _proto._scheduleUpdates = function _scheduleUpdates(task) {
    var scheduler = this._scheduler;
    if (scheduler != null) {
      scheduler.schedule(task);
    } else {
      task();
    }
  };
  _proto.execute = function execute(_ref) {
    var _this7 = this;
    var operation = _ref.operation;
    return this._execute({
      createSource: function createSource() {
        return _this7.getNetwork().execute(operation.request.node.params, operation.request.variables, operation.request.cacheConfig || {}, null);
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: null,
      updater: null
    });
  };
  _proto.executeSubscription = function executeSubscription(_ref2) {
    var _this8 = this;
    var operation = _ref2.operation,
      updater = _ref2.updater;
    return this._execute({
      createSource: function createSource() {
        return _this8.getNetwork().execute(operation.request.node.params, operation.request.variables, operation.request.cacheConfig || {}, null);
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: null,
      updater: updater
    });
  };
  _proto.executeMutation = function executeMutation(_ref3) {
    var _this9 = this;
    var operation = _ref3.operation,
      optimisticResponse = _ref3.optimisticResponse,
      optimisticUpdater = _ref3.optimisticUpdater,
      updater = _ref3.updater,
      uploadables = _ref3.uploadables;
    var optimisticConfig;
    if (optimisticResponse || optimisticUpdater) {
      optimisticConfig = {
        operation: operation,
        response: optimisticResponse,
        updater: optimisticUpdater
      };
    }
    return this._execute({
      createSource: function createSource() {
        return _this9.getNetwork().execute(operation.request.node.params, operation.request.variables, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, operation.request.cacheConfig), {}, {
          force: true
        }), uploadables);
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: optimisticConfig,
      updater: updater
    });
  };
  _proto.executeWithSource = function executeWithSource(_ref4) {
    var operation = _ref4.operation,
      source = _ref4.source;
    return this._execute({
      createSource: function createSource() {
        return source;
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: null,
      updater: null
    });
  };
  _proto.toJSON = function toJSON() {
    var _this$configName;
    return "RelayModernEnvironment(".concat((_this$configName = this.configName) !== null && _this$configName !== void 0 ? _this$configName : '', ")");
  };
  _proto._execute = function _execute(_ref5) {
    var _this10 = this;
    var createSource = _ref5.createSource,
      isClientPayload = _ref5.isClientPayload,
      operation = _ref5.operation,
      optimisticConfig = _ref5.optimisticConfig,
      updater = _ref5.updater;
    var publishQueue = this._publishQueue;
    var store = this._store;
    return RelayObservable.create(function (sink) {
      var executor = OperationExecutor.execute({
        actorIdentifier: INTERNAL_ACTOR_IDENTIFIER_DO_NOT_USE,
        getDataID: _this10._getDataID,
        isClientPayload: isClientPayload,
        log: _this10.__log,
        operation: operation,
        operationExecutions: _this10._operationExecutions,
        operationLoader: _this10._operationLoader,
        operationTracker: _this10._operationTracker,
        optimisticConfig: optimisticConfig,
        getPublishQueue: function getPublishQueue(actorIdentifier) {
          assertInternalActorIdentifier(actorIdentifier);
          return publishQueue;
        },
        scheduler: _this10._scheduler,
        shouldProcessClientComponents: _this10._shouldProcessClientComponents,
        sink: sink,
        source: createSource(),
        getStore: function getStore(actorIdentifier) {
          assertInternalActorIdentifier(actorIdentifier);
          return store;
        },
        treatMissingFieldsAsNull: _this10._treatMissingFieldsAsNull,
        updater: updater,
        normalizeResponse: _this10._normalizeResponse
      });
      return function () {
        return executor.cancel();
      };
    });
  };
  return RelayModernEnvironment;
}();
function operationHasClientAbstractTypes(operation) {
  return operation.root.node.kind === 'Operation' && operation.root.node.clientAbstractTypes != null;
}
RelayModernEnvironment.prototype['@@RelayModernEnvironment'] = true;
function emptyFunction() {}
module.exports = RelayModernEnvironment;