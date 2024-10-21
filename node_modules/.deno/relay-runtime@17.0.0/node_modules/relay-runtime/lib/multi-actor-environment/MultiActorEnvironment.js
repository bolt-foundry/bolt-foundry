'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var RelayDefaultHandlerProvider = require('../handlers/RelayDefaultHandlerProvider');
var RelayObservable = require('../network/RelayObservable');
var defaultGetDataID = require('../store/defaultGetDataID');
var defaultRelayFieldLogger = require('../store/defaultRelayFieldLogger');
var normalizeResponse = require('../store/normalizeResponse');
var OperationExecutor = require('../store/OperationExecutor');
var RelayModernStore = require('../store/RelayModernStore');
var RelayRecordSource = require('../store/RelayRecordSource');
var ActorSpecificEnvironment = require('./ActorSpecificEnvironment');
var MultiActorEnvironment = /*#__PURE__*/function () {
  function MultiActorEnvironment(config) {
    var _config$getDataID, _config$logFn, _config$relayFieldLog, _config$treatMissingF, _config$isServer, _config$missingFieldH, _config$defaultRender, _config$normalizeResp;
    this._actorEnvironments = new Map();
    this._operationLoader = config.operationLoader;
    this._createNetworkForActor = config.createNetworkForActor;
    this._scheduler = config.scheduler;
    this._getDataID = (_config$getDataID = config.getDataID) !== null && _config$getDataID !== void 0 ? _config$getDataID : defaultGetDataID;
    this._handlerProvider = config.handlerProvider ? config.handlerProvider : RelayDefaultHandlerProvider;
    this._logFn = (_config$logFn = config.logFn) !== null && _config$logFn !== void 0 ? _config$logFn : emptyFunction;
    this._operationExecutions = new Map();
    this._relayFieldLogger = (_config$relayFieldLog = config.relayFieldLogger) !== null && _config$relayFieldLog !== void 0 ? _config$relayFieldLog : defaultRelayFieldLogger;
    this._shouldProcessClientComponents = config.shouldProcessClientComponents;
    this._treatMissingFieldsAsNull = (_config$treatMissingF = config.treatMissingFieldsAsNull) !== null && _config$treatMissingF !== void 0 ? _config$treatMissingF : false;
    this._isServer = (_config$isServer = config.isServer) !== null && _config$isServer !== void 0 ? _config$isServer : false;
    this._missingFieldHandlers = (_config$missingFieldH = config.missingFieldHandlers) !== null && _config$missingFieldH !== void 0 ? _config$missingFieldH : [];
    this._createStoreForActor = config.createStoreForActor;
    this._createConfigNameForActor = config.createConfigNameForActor;
    this._defaultRenderPolicy = (_config$defaultRender = config.defaultRenderPolicy) !== null && _config$defaultRender !== void 0 ? _config$defaultRender : 'partial';
    this._normalizeResponse = (_config$normalizeResp = config.normalizeResponse) !== null && _config$normalizeResp !== void 0 ? _config$normalizeResp : normalizeResponse;
  }
  var _proto = MultiActorEnvironment.prototype;
  _proto.forActor = function forActor(actorIdentifier) {
    var environment = this._actorEnvironments.get(actorIdentifier);
    if (environment == null) {
      var newEnvironment = new ActorSpecificEnvironment({
        configName: this._createConfigNameForActor ? this._createConfigNameForActor(actorIdentifier) : null,
        actorIdentifier: actorIdentifier,
        multiActorEnvironment: this,
        logFn: this._logFn,
        relayFieldLogger: this._relayFieldLogger,
        store: this._createStoreForActor != null ? this._createStoreForActor(actorIdentifier) : new RelayModernStore(RelayRecordSource.create()),
        network: this._createNetworkForActor(actorIdentifier),
        handlerProvider: this._handlerProvider,
        defaultRenderPolicy: this._defaultRenderPolicy,
        missingFieldHandlers: this._missingFieldHandlers
      });
      this._actorEnvironments.set(actorIdentifier, newEnvironment);
      return newEnvironment;
    } else {
      return environment;
    }
  };
  _proto.check = function check(actorEnvironment, operation) {
    var _this = this;
    if (this._missingFieldHandlers == null || this._missingFieldHandlers.length === 0) {
      return actorEnvironment.getStore().check(operation, {
        handlers: [],
        defaultActorIdentifier: actorEnvironment.actorIdentifier,
        getSourceForActor: function getSourceForActor(actorIdentifier) {
          return _this.forActor(actorIdentifier).getStore().getSource();
        },
        getTargetForActor: function getTargetForActor() {
          return RelayRecordSource.create();
        }
      });
    }
    return this._checkSelectorAndHandleMissingFields(actorEnvironment, operation, this._missingFieldHandlers);
  };
  _proto._checkSelectorAndHandleMissingFields = function _checkSelectorAndHandleMissingFields(actorEnvironment, operation, handlers) {
    var _this2 = this;
    var targets = new Map([[actorEnvironment.actorIdentifier, RelayRecordSource.create()]]);
    var result = actorEnvironment.getStore().check(operation, {
      handlers: handlers,
      defaultActorIdentifier: actorEnvironment.actorIdentifier,
      getSourceForActor: function getSourceForActor(actorIdentifier) {
        return _this2.forActor(actorIdentifier).getStore().getSource();
      },
      getTargetForActor: function getTargetForActor(actorIdentifier) {
        var target = targets.get(actorIdentifier);
        if (target == null) {
          target = RelayRecordSource.create();
          targets.set(actorIdentifier, target);
        }
        return target;
      }
    });
    var _iterator = (0, _createForOfIteratorHelper2["default"])(targets),
      _step;
    try {
      var _loop = function _loop() {
        var _step$value = _step.value,
          actorIdentifier = _step$value[0],
          target = _step$value[1];
        if (target.size() > 0) {
          _this2._scheduleUpdates(function () {
            var publishQueue = _this2.forActor(actorIdentifier).getPublishQueue();
            publishQueue.commitSource(target);
            publishQueue.run();
          });
        }
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return result;
  };
  _proto.subscribe = function subscribe(actorEnvironment, snapshot, callback) {
    return actorEnvironment.getStore().subscribe(snapshot, callback);
  };
  _proto.retain = function retain(actorEnvironment, operation) {
    return actorEnvironment.getStore().retain(operation);
  };
  _proto.applyUpdate = function applyUpdate(actorEnvironment, optimisticUpdate) {
    var _this3 = this;
    var publishQueue = actorEnvironment.getPublishQueue();
    var dispose = function dispose() {
      _this3._scheduleUpdates(function () {
        publishQueue.revertUpdate(optimisticUpdate);
        publishQueue.run();
      });
    };
    this._scheduleUpdates(function () {
      publishQueue.applyUpdate(optimisticUpdate);
      publishQueue.run();
    });
    return {
      dispose: dispose
    };
  };
  _proto.revertUpdate = function revertUpdate(actorEnvironment, update) {
    var publishQueue = actorEnvironment.getPublishQueue();
    this._scheduleUpdates(function () {
      publishQueue.revertUpdate(update);
      publishQueue.run();
    });
  };
  _proto.replaceUpdate = function replaceUpdate(actorEnvironment, update, replacement) {
    var publishQueue = actorEnvironment.getPublishQueue();
    this._scheduleUpdates(function () {
      publishQueue.revertUpdate(update);
      publishQueue.applyUpdate(replacement);
      publishQueue.run();
    });
  };
  _proto.applyMutation = function applyMutation(actorEnvironment, optimisticConfig) {
    var subscription = this._execute(actorEnvironment, {
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
  _proto.commitUpdate = function commitUpdate(actorEnvironment, updater) {
    var publishQueue = actorEnvironment.getPublishQueue();
    this._scheduleUpdates(function () {
      publishQueue.commitUpdate(updater);
      publishQueue.run();
    });
  };
  _proto.commitPayload = function commitPayload(actorEnvironment, operationDescriptor, payload) {
    this._execute(actorEnvironment, {
      createSource: function createSource() {
        return RelayObservable.from({
          data: payload
        });
      },
      isClientPayload: true,
      operation: operationDescriptor,
      optimisticConfig: null,
      updater: null
    }).subscribe({});
  };
  _proto.lookup = function lookup(actorEnvironment, selector) {
    return actorEnvironment.getStore().lookup(selector);
  };
  _proto.execute = function execute(actorEnvironment, _ref) {
    var operation = _ref.operation;
    return this._execute(actorEnvironment, {
      createSource: function createSource() {
        return actorEnvironment.getNetwork().execute(operation.request.node.params, operation.request.variables, operation.request.cacheConfig || {}, null);
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: null,
      updater: null
    });
  };
  _proto.executeSubscription = function executeSubscription(actorEnvironment, _ref2) {
    var operation = _ref2.operation,
      updater = _ref2.updater;
    return this._execute(actorEnvironment, {
      createSource: function createSource() {
        return actorEnvironment.getNetwork().execute(operation.request.node.params, operation.request.variables, operation.request.cacheConfig || {}, null);
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: null,
      updater: updater
    });
  };
  _proto.executeMutation = function executeMutation(actorEnvironment, _ref3) {
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
    return this._execute(actorEnvironment, {
      createSource: function createSource() {
        return actorEnvironment.getNetwork().execute(operation.request.node.params, operation.request.variables, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, operation.request.cacheConfig), {}, {
          force: true
        }), uploadables);
      },
      isClientPayload: false,
      operation: operation,
      optimisticConfig: optimisticConfig,
      updater: updater
    });
  };
  _proto.executeWithSource = function executeWithSource(actorEnvironment, config) {
    return this._execute(actorEnvironment, {
      createSource: function createSource() {
        return config.source;
      },
      isClientPayload: false,
      operation: config.operation,
      optimisticConfig: null,
      updater: null
    });
  };
  _proto.isRequestActive = function isRequestActive(_actorEnvironment, requestIdentifier) {
    var activeState = this._operationExecutions.get(requestIdentifier);
    return activeState === 'active';
  };
  _proto.isServer = function isServer() {
    return this._isServer;
  };
  _proto._execute = function _execute(actorEnvironment, _ref4) {
    var _this4 = this;
    var createSource = _ref4.createSource,
      isClientPayload = _ref4.isClientPayload,
      operation = _ref4.operation,
      optimisticConfig = _ref4.optimisticConfig,
      updater = _ref4.updater;
    return RelayObservable.create(function (sink) {
      var executor = OperationExecutor.execute({
        actorIdentifier: actorEnvironment.actorIdentifier,
        getDataID: _this4._getDataID,
        isClientPayload: isClientPayload,
        operation: operation,
        operationExecutions: _this4._operationExecutions,
        operationLoader: _this4._operationLoader,
        operationTracker: actorEnvironment.getOperationTracker(),
        optimisticConfig: optimisticConfig,
        getPublishQueue: function getPublishQueue(actorIdentifier) {
          return _this4.forActor(actorIdentifier).getPublishQueue();
        },
        scheduler: _this4._scheduler,
        shouldProcessClientComponents: _this4._shouldProcessClientComponents,
        sink: sink,
        source: createSource(),
        getStore: function getStore(actorIdentifier) {
          return _this4.forActor(actorIdentifier).getStore();
        },
        treatMissingFieldsAsNull: _this4._treatMissingFieldsAsNull,
        updater: updater,
        log: _this4._logFn,
        normalizeResponse: _this4._normalizeResponse
      });
      return function () {
        return executor.cancel();
      };
    });
  };
  _proto._scheduleUpdates = function _scheduleUpdates(task) {
    var scheduler = this._scheduler;
    if (scheduler != null) {
      scheduler.schedule(task);
    } else {
      task();
    }
  };
  _proto.commitMultiActorUpdate = function commitMultiActorUpdate(updater) {
    var _iterator2 = (0, _createForOfIteratorHelper2["default"])(this._actorEnvironments),
      _step2;
    try {
      var _loop2 = function _loop2() {
        var _step2$value = _step2.value,
          actorIdentifier = _step2$value[0],
          environment = _step2$value[1];
        environment.commitUpdate(function (storeProxy) {
          updater(actorIdentifier, environment, storeProxy);
        });
      };
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        _loop2();
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };
  _proto.getScheduler = function getScheduler() {
    return this._scheduler;
  };
  return MultiActorEnvironment;
}();
function emptyFunction() {}
module.exports = MultiActorEnvironment;