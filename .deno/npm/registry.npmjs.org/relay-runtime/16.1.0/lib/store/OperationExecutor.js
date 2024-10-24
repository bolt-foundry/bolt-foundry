'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var RelayObservable = require('../network/RelayObservable');
var generateID = require('../util/generateID');
var getOperation = require('../util/getOperation');
var RelayError = require('../util/RelayError');
var RelayFeatureFlags = require('../util/RelayFeatureFlags');
var stableCopy = require('../util/stableCopy');
var withDuration = require('../util/withDuration');
var _require = require('./ClientID'),
  generateClientID = _require.generateClientID,
  generateUniqueClientID = _require.generateUniqueClientID;
var _require2 = require('./RelayConcreteVariables'),
  getLocalVariables = _require2.getLocalVariables;
var RelayModernRecord = require('./RelayModernRecord');
var _require3 = require('./RelayModernSelector'),
  createNormalizationSelector = _require3.createNormalizationSelector,
  createReaderSelector = _require3.createReaderSelector;
var RelayRecordSource = require('./RelayRecordSource');
var _require4 = require('./RelayStoreUtils'),
  ROOT_TYPE = _require4.ROOT_TYPE,
  TYPENAME_KEY = _require4.TYPENAME_KEY,
  getStorageKey = _require4.getStorageKey;
var invariant = require('invariant');
var warning = require("fbjs/lib/warning");
function execute(config) {
  return new Executor(config);
}
var Executor = /*#__PURE__*/function () {
  function Executor(_ref2) {
    var _this = this;
    var actorIdentifier = _ref2.actorIdentifier,
      getDataID = _ref2.getDataID,
      getPublishQueue = _ref2.getPublishQueue,
      getStore = _ref2.getStore,
      isClientPayload = _ref2.isClientPayload,
      operation = _ref2.operation,
      operationExecutions = _ref2.operationExecutions,
      operationLoader = _ref2.operationLoader,
      operationTracker = _ref2.operationTracker,
      optimisticConfig = _ref2.optimisticConfig,
      scheduler = _ref2.scheduler,
      shouldProcessClientComponents = _ref2.shouldProcessClientComponents,
      sink = _ref2.sink,
      source = _ref2.source,
      treatMissingFieldsAsNull = _ref2.treatMissingFieldsAsNull,
      updater = _ref2.updater,
      log = _ref2.log,
      normalizeResponse = _ref2.normalizeResponse;
    this._actorIdentifier = actorIdentifier;
    this._getDataID = getDataID;
    this._treatMissingFieldsAsNull = treatMissingFieldsAsNull;
    this._incrementalPayloadsPending = false;
    this._incrementalResults = new Map();
    this._log = log;
    this._executeId = generateID();
    this._nextSubscriptionId = 0;
    this._operation = operation;
    this._operationExecutions = operationExecutions;
    this._operationLoader = operationLoader;
    this._operationTracker = operationTracker;
    this._operationUpdateEpochs = new Map();
    this._optimisticUpdates = null;
    this._pendingModulePayloadsCount = 0;
    this._getPublishQueue = getPublishQueue;
    this._scheduler = scheduler;
    this._sink = sink;
    this._source = new Map();
    this._state = 'started';
    this._getStore = getStore;
    this._subscriptions = new Map();
    this._updater = updater;
    this._isClientPayload = isClientPayload === true;
    this._isSubscriptionOperation = this._operation.request.node.params.operationKind === 'subscription';
    this._shouldProcessClientComponents = shouldProcessClientComponents;
    this._retainDisposables = new Map();
    this._seenActors = new Set();
    this._completeFns = [];
    this._normalizeResponse = normalizeResponse;
    var id = this._nextSubscriptionId++;
    source.subscribe({
      complete: function complete() {
        return _this._complete(id);
      },
      error: function error(_error2) {
        return _this._error(_error2);
      },
      next: function next(response) {
        try {
          _this._next(id, response);
        } catch (error) {
          sink.error(error);
        }
      },
      start: function start(subscription) {
        var _this$_operation$requ;
        _this._start(id, subscription);
        _this._log({
          name: 'execute.start',
          executeId: _this._executeId,
          params: _this._operation.request.node.params,
          variables: _this._operation.request.variables,
          cacheConfig: (_this$_operation$requ = _this._operation.request.cacheConfig) !== null && _this$_operation$requ !== void 0 ? _this$_operation$requ : {}
        });
      }
    });
    if (optimisticConfig != null) {
      this._processOptimisticResponse(optimisticConfig.response != null ? {
        data: optimisticConfig.response
      } : null, optimisticConfig.updater, false);
    }
  }
  var _proto = Executor.prototype;
  _proto.cancel = function cancel() {
    var _this2 = this;
    if (this._state === 'completed') {
      return;
    }
    this._state = 'completed';
    this._operationExecutions["delete"](this._operation.request.identifier);
    if (this._subscriptions.size !== 0) {
      this._subscriptions.forEach(function (sub) {
        return sub.unsubscribe();
      });
      this._subscriptions.clear();
    }
    var optimisticUpdates = this._optimisticUpdates;
    if (optimisticUpdates !== null) {
      this._optimisticUpdates = null;
      optimisticUpdates.forEach(function (update) {
        return _this2._getPublishQueueAndSaveActor().revertUpdate(update);
      });
      this._runPublishQueue();
    }
    this._incrementalResults.clear();
    if (this._asyncStoreUpdateDisposable != null) {
      this._asyncStoreUpdateDisposable.dispose();
      this._asyncStoreUpdateDisposable = null;
    }
    this._completeFns = [];
    this._completeOperationTracker();
    this._disposeRetainedData();
  };
  _proto._updateActiveState = function _updateActiveState() {
    var activeState;
    switch (this._state) {
      case 'started':
        {
          activeState = 'active';
          break;
        }
      case 'loading_incremental':
        {
          activeState = 'active';
          break;
        }
      case 'completed':
        {
          activeState = 'inactive';
          break;
        }
      case 'loading_final':
        {
          activeState = this._pendingModulePayloadsCount > 0 ? 'active' : 'inactive';
          break;
        }
      default:
        this._state;
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: invalid executor state.') : invariant(false) : void 0;
    }
    this._operationExecutions.set(this._operation.request.identifier, activeState);
  };
  _proto._schedule = function _schedule(task) {
    var _this3 = this;
    var scheduler = this._scheduler;
    if (scheduler != null) {
      var id = this._nextSubscriptionId++;
      RelayObservable.create(function (sink) {
        var cancellationToken = scheduler.schedule(function () {
          try {
            task();
            sink.complete();
          } catch (error) {
            sink.error(error);
          }
        });
        return function () {
          return scheduler.cancel(cancellationToken);
        };
      }).subscribe({
        complete: function complete() {
          return _this3._complete(id);
        },
        error: function error(_error3) {
          return _this3._error(_error3);
        },
        start: function start(subscription) {
          return _this3._start(id, subscription);
        }
      });
    } else {
      task();
    }
  };
  _proto._complete = function _complete(id) {
    this._subscriptions["delete"](id);
    if (this._subscriptions.size === 0) {
      this.cancel();
      this._sink.complete();
      this._log({
        name: 'execute.complete',
        executeId: this._executeId
      });
    }
  };
  _proto._error = function _error(error) {
    this.cancel();
    this._sink.error(error);
    this._log({
      name: 'execute.error',
      executeId: this._executeId,
      error: error
    });
  };
  _proto._start = function _start(id, subscription) {
    this._subscriptions.set(id, subscription);
    this._updateActiveState();
  };
  _proto._next = function _next(_id, response) {
    var _this4 = this;
    this._schedule(function () {
      var _withDuration = withDuration(function () {
          _this4._handleNext(response);
          _this4._maybeCompleteSubscriptionOperationTracking();
        }),
        duration = _withDuration[0];
      _this4._log({
        name: 'execute.next',
        executeId: _this4._executeId,
        response: response,
        duration: duration
      });
    });
  };
  _proto._handleErrorResponse = function _handleErrorResponse(responses) {
    var _this5 = this;
    var results = [];
    responses.forEach(function (response) {
      if (response.data === null && response.extensions != null && !response.hasOwnProperty('errors')) {
        return;
      } else if (response.data == null) {
        var errors = response.hasOwnProperty('errors') && response.errors != null ? response.errors : null;
        var messages = errors ? errors.map(function (_ref3) {
          var message = _ref3.message;
          return message;
        }).join('\n') : '(No errors)';
        var error = RelayError.create('RelayNetwork', 'No data returned for operation `' + _this5._operation.request.node.params.name + '`, got error(s):\n' + messages + '\n\nSee the error `source` property for more information.');
        error.source = {
          errors: errors,
          operation: _this5._operation.request.node,
          variables: _this5._operation.request.variables
        };
        error.stack;
        throw error;
      } else {
        var responseWithData = response;
        results.push(responseWithData);
      }
    });
    return results;
  };
  _proto._handleOptimisticResponses = function _handleOptimisticResponses(responses) {
    var _response$extensions;
    if (responses.length > 1) {
      if (responses.some(function (responsePart) {
        var _responsePart$extensi;
        return ((_responsePart$extensi = responsePart.extensions) === null || _responsePart$extensi === void 0 ? void 0 : _responsePart$extensi.isOptimistic) === true;
      })) {
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Optimistic responses cannot be batched.') : invariant(false) : void 0;
      }
      return false;
    }
    var response = responses[0];
    var isOptimistic = ((_response$extensions = response.extensions) === null || _response$extensions === void 0 ? void 0 : _response$extensions.isOptimistic) === true;
    if (isOptimistic && this._state !== 'started') {
      !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: optimistic payload received after server payload.') : invariant(false) : void 0;
    }
    if (isOptimistic) {
      this._processOptimisticResponse(response, null, this._treatMissingFieldsAsNull);
      this._sink.next(response);
      return true;
    }
    return false;
  };
  _proto._handleNext = function _handleNext(response) {
    if (this._state === 'completed') {
      return;
    }
    this._seenActors.clear();
    var responses = Array.isArray(response) ? response : [response];
    var responsesWithData = this._handleErrorResponse(responses);
    if (responsesWithData.length === 0) {
      var isFinal = responses.some(function (x) {
        var _x$extensions;
        return ((_x$extensions = x.extensions) === null || _x$extensions === void 0 ? void 0 : _x$extensions.is_final) === true;
      });
      if (isFinal) {
        this._state = 'loading_final';
        this._updateActiveState();
        this._incrementalPayloadsPending = false;
      }
      this._sink.next(response);
      return;
    }
    var isOptimistic = this._handleOptimisticResponses(responsesWithData);
    if (isOptimistic) {
      return;
    }
    var _partitionGraphQLResp = partitionGraphQLResponses(responsesWithData),
      nonIncrementalResponses = _partitionGraphQLResp[0],
      incrementalResponses = _partitionGraphQLResp[1];
    var hasNonIncrementalResponses = nonIncrementalResponses.length > 0;
    if (hasNonIncrementalResponses) {
      if (this._isSubscriptionOperation) {
        var nextID = generateUniqueClientID();
        this._operation = {
          request: this._operation.request,
          fragment: createReaderSelector(this._operation.fragment.node, nextID, this._operation.fragment.variables, this._operation.fragment.owner),
          root: createNormalizationSelector(this._operation.root.node, nextID, this._operation.root.variables)
        };
      }
      var payloadFollowups = this._processResponses(nonIncrementalResponses);
      this._processPayloadFollowups(payloadFollowups);
    }
    if (incrementalResponses.length > 0) {
      var _payloadFollowups = this._processIncrementalResponses(incrementalResponses);
      this._processPayloadFollowups(_payloadFollowups);
    }
    if (this._isSubscriptionOperation) {
      if (responsesWithData[0].extensions == null) {
        responsesWithData[0].extensions = {
          __relay_subscription_root_id: this._operation.fragment.dataID
        };
      } else {
        responsesWithData[0].extensions.__relay_subscription_root_id = this._operation.fragment.dataID;
      }
    }
    var updatedOwners = this._runPublishQueue(hasNonIncrementalResponses ? this._operation : undefined);
    if (hasNonIncrementalResponses) {
      if (this._incrementalPayloadsPending) {
        this._retainData();
      }
    }
    this._updateOperationTracker(updatedOwners);
    this._sink.next(response);
  };
  _proto._processOptimisticResponse = function _processOptimisticResponse(response, updater, treatMissingFieldsAsNull) {
    var _this6 = this;
    !(this._optimisticUpdates === null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: environment.execute: only support one optimistic response per ' + 'execute.') : invariant(false) : void 0;
    if (response == null && updater == null) {
      return;
    }
    var optimisticUpdates = [];
    if (response) {
      var payload = this._normalizeResponse(response, this._operation.root, ROOT_TYPE, {
        actorIdentifier: this._actorIdentifier,
        getDataID: this._getDataID,
        path: [],
        shouldProcessClientComponents: this._shouldProcessClientComponents,
        treatMissingFieldsAsNull: treatMissingFieldsAsNull
      });
      validateOptimisticResponsePayload(payload);
      optimisticUpdates.push({
        operation: this._operation,
        payload: payload,
        updater: updater
      });
      this._processOptimisticFollowups(payload, optimisticUpdates);
    } else if (updater) {
      optimisticUpdates.push({
        operation: this._operation,
        payload: {
          errors: null,
          fieldPayloads: null,
          incrementalPlaceholders: null,
          followupPayloads: null,
          source: RelayRecordSource.create(),
          isFinal: false
        },
        updater: updater
      });
    }
    this._optimisticUpdates = optimisticUpdates;
    optimisticUpdates.forEach(function (update) {
      return _this6._getPublishQueueAndSaveActor().applyUpdate(update);
    });
    var updatedOwners = this._runPublishQueue();
    if (RelayFeatureFlags.ENABLE_OPERATION_TRACKER_OPTIMISTIC_UPDATES) {
      this._updateOperationTracker(updatedOwners);
    }
  };
  _proto._processOptimisticFollowups = function _processOptimisticFollowups(payload, optimisticUpdates) {
    if (payload.followupPayloads && payload.followupPayloads.length) {
      var followupPayloads = payload.followupPayloads;
      var _iterator = (0, _createForOfIteratorHelper2["default"])(followupPayloads),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var followupPayload = _step.value;
          switch (followupPayload.kind) {
            case 'ModuleImportPayload':
              var operationLoader = this._expectOperationLoader();
              var operation = operationLoader.get(followupPayload.operationReference);
              if (operation == null) {
                this._processAsyncOptimisticModuleImport(followupPayload);
              } else {
                var moduleImportOptimisticUpdates = this._processOptimisticModuleImport(operation, followupPayload);
                optimisticUpdates.push.apply(optimisticUpdates, (0, _toConsumableArray2["default"])(moduleImportOptimisticUpdates));
              }
              break;
            case 'ActorPayload':
              process.env.NODE_ENV !== "production" ? warning(false, 'OperationExecutor: Unexpected optimistic ActorPayload. These updates are not supported.') : void 0;
              break;
            default:
              followupPayload;
              !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Unexpected followup kind `%s`. when processing optimistic updates.', followupPayload.kind) : invariant(false) : void 0;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  };
  _proto._normalizeFollowupPayload = function _normalizeFollowupPayload(followupPayload, normalizationNode) {
    var variables;
    if (normalizationNode.kind === 'SplitOperation' && followupPayload.kind === 'ModuleImportPayload') {
      variables = getLocalVariables(followupPayload.variables, normalizationNode.argumentDefinitions, followupPayload.args);
    } else {
      variables = followupPayload.variables;
    }
    var selector = createNormalizationSelector(normalizationNode, followupPayload.dataID, variables);
    return this._normalizeResponse({
      data: followupPayload.data
    }, selector, followupPayload.typeName, {
      actorIdentifier: this._actorIdentifier,
      getDataID: this._getDataID,
      path: followupPayload.path,
      treatMissingFieldsAsNull: this._treatMissingFieldsAsNull,
      shouldProcessClientComponents: this._shouldProcessClientComponents
    });
  };
  _proto._processOptimisticModuleImport = function _processOptimisticModuleImport(normalizationRootNode, moduleImportPayload) {
    var operation = getOperation(normalizationRootNode);
    var optimisticUpdates = [];
    var modulePayload = this._normalizeFollowupPayload(moduleImportPayload, operation);
    validateOptimisticResponsePayload(modulePayload);
    optimisticUpdates.push({
      operation: this._operation,
      payload: modulePayload,
      updater: null
    });
    this._processOptimisticFollowups(modulePayload, optimisticUpdates);
    return optimisticUpdates;
  };
  _proto._processAsyncOptimisticModuleImport = function _processAsyncOptimisticModuleImport(moduleImportPayload) {
    var _this7 = this;
    this._expectOperationLoader().load(moduleImportPayload.operationReference).then(function (operation) {
      if (operation == null || _this7._state !== 'started') {
        return;
      }
      var moduleImportOptimisticUpdates = _this7._processOptimisticModuleImport(operation, moduleImportPayload);
      moduleImportOptimisticUpdates.forEach(function (update) {
        return _this7._getPublishQueueAndSaveActor().applyUpdate(update);
      });
      if (_this7._optimisticUpdates == null) {
        process.env.NODE_ENV !== "production" ? warning(false, 'OperationExecutor: Unexpected ModuleImport optimistic ' + 'update in operation %s.' + _this7._operation.request.node.params.name) : void 0;
      } else {
        var _this$_optimisticUpda;
        (_this$_optimisticUpda = _this7._optimisticUpdates).push.apply(_this$_optimisticUpda, (0, _toConsumableArray2["default"])(moduleImportOptimisticUpdates));
        _this7._runPublishQueue();
      }
    });
  };
  _proto._processResponses = function _processResponses(responses) {
    var _this8 = this;
    if (this._optimisticUpdates !== null) {
      this._optimisticUpdates.forEach(function (update) {
        _this8._getPublishQueueAndSaveActor().revertUpdate(update);
      });
      this._optimisticUpdates = null;
    }
    this._incrementalPayloadsPending = false;
    this._incrementalResults.clear();
    this._source.clear();
    return responses.map(function (payloadPart) {
      var relayPayload = _this8._normalizeResponse(payloadPart, _this8._operation.root, ROOT_TYPE, {
        actorIdentifier: _this8._actorIdentifier,
        getDataID: _this8._getDataID,
        path: [],
        treatMissingFieldsAsNull: _this8._treatMissingFieldsAsNull,
        shouldProcessClientComponents: _this8._shouldProcessClientComponents
      });
      _this8._getPublishQueueAndSaveActor().commitPayload(_this8._operation, relayPayload, _this8._updater);
      return relayPayload;
    });
  };
  _proto._processPayloadFollowups = function _processPayloadFollowups(payloads) {
    var _this9 = this;
    if (this._state === 'completed') {
      return;
    }
    payloads.forEach(function (payload) {
      var incrementalPlaceholders = payload.incrementalPlaceholders,
        followupPayloads = payload.followupPayloads,
        isFinal = payload.isFinal;
      _this9._state = isFinal ? 'loading_final' : 'loading_incremental';
      _this9._updateActiveState();
      if (isFinal) {
        _this9._incrementalPayloadsPending = false;
      }
      if (followupPayloads && followupPayloads.length !== 0) {
        followupPayloads.forEach(function (followupPayload) {
          var _followupPayload$acto;
          var prevActorIdentifier = _this9._actorIdentifier;
          _this9._actorIdentifier = (_followupPayload$acto = followupPayload.actorIdentifier) !== null && _followupPayload$acto !== void 0 ? _followupPayload$acto : _this9._actorIdentifier;
          _this9._processFollowupPayload(followupPayload);
          _this9._actorIdentifier = prevActorIdentifier;
        });
      }
      if (incrementalPlaceholders && incrementalPlaceholders.length !== 0) {
        _this9._incrementalPayloadsPending = _this9._state !== 'loading_final';
        incrementalPlaceholders.forEach(function (incrementalPlaceholder) {
          var _incrementalPlacehold;
          var prevActorIdentifier = _this9._actorIdentifier;
          _this9._actorIdentifier = (_incrementalPlacehold = incrementalPlaceholder.actorIdentifier) !== null && _incrementalPlacehold !== void 0 ? _incrementalPlacehold : _this9._actorIdentifier;
          _this9._processIncrementalPlaceholder(payload, incrementalPlaceholder);
          _this9._actorIdentifier = prevActorIdentifier;
        });
        if (_this9._isClientPayload || _this9._state === 'loading_final') {
          process.env.NODE_ENV !== "production" ? warning(_this9._isClientPayload, 'RelayModernEnvironment: Operation `%s` contains @defer/@stream ' + 'directives but was executed in non-streaming mode. See ' + 'https://fburl.com/relay-incremental-delivery-non-streaming-warning.', _this9._operation.request.node.params.name) : void 0;
          var relayPayloads = [];
          incrementalPlaceholders.forEach(function (placeholder) {
            if (placeholder.kind === 'defer') {
              relayPayloads.push(_this9._processDeferResponse(placeholder.label, placeholder.path, placeholder, {
                data: placeholder.data
              }));
            }
          });
          if (relayPayloads.length > 0) {
            _this9._processPayloadFollowups(relayPayloads);
          }
        }
      }
    });
  };
  _proto._maybeCompleteSubscriptionOperationTracking = function _maybeCompleteSubscriptionOperationTracking() {
    if (!this._isSubscriptionOperation) {
      return;
    }
    if (this._pendingModulePayloadsCount === 0 && this._incrementalPayloadsPending === false) {
      this._completeOperationTracker();
    }
  };
  _proto._processFollowupPayload = function _processFollowupPayload(followupPayload) {
    var _this10 = this;
    switch (followupPayload.kind) {
      case 'ModuleImportPayload':
        var operationLoader = this._expectOperationLoader();
        var node = operationLoader.get(followupPayload.operationReference);
        if (node != null) {
          this._processFollowupPayloadWithNormalizationNode(followupPayload, getOperation(node));
        } else {
          var id = this._nextSubscriptionId++;
          this._pendingModulePayloadsCount++;
          var decrementPendingCount = function decrementPendingCount() {
            _this10._pendingModulePayloadsCount--;
            _this10._maybeCompleteSubscriptionOperationTracking();
          };
          var networkObservable = RelayObservable.from(new Promise(function (resolve, reject) {
            operationLoader.load(followupPayload.operationReference).then(resolve, reject);
          }));
          RelayObservable.create(function (sink) {
            var cancellationToken;
            var subscription = networkObservable.subscribe({
              next: function next(loadedNode) {
                if (loadedNode != null) {
                  var publishModuleImportPayload = function publishModuleImportPayload() {
                    try {
                      var operation = getOperation(loadedNode);
                      var batchAsyncModuleUpdatesFN = RelayFeatureFlags.BATCH_ASYNC_MODULE_UPDATES_FN;
                      var shouldScheduleAsyncStoreUpdate = batchAsyncModuleUpdatesFN != null && _this10._pendingModulePayloadsCount > 1;
                      var _withDuration2 = withDuration(function () {
                          _this10._handleFollowupPayload(followupPayload, operation);
                          if (shouldScheduleAsyncStoreUpdate) {
                            _this10._scheduleAsyncStoreUpdate(batchAsyncModuleUpdatesFN, sink.complete);
                          } else {
                            var updatedOwners = _this10._runPublishQueue();
                            _this10._updateOperationTracker(updatedOwners);
                          }
                        }),
                        duration = _withDuration2[0];
                      _this10._log({
                        name: 'execute.async.module',
                        executeId: _this10._executeId,
                        operationName: operation.name,
                        duration: duration
                      });
                      if (!shouldScheduleAsyncStoreUpdate) {
                        sink.complete();
                      }
                    } catch (error) {
                      sink.error(error);
                    }
                  };
                  var scheduler = _this10._scheduler;
                  if (scheduler == null) {
                    publishModuleImportPayload();
                  } else {
                    cancellationToken = scheduler.schedule(publishModuleImportPayload);
                  }
                } else {
                  sink.complete();
                }
              },
              error: sink.error
            });
            return function () {
              subscription.unsubscribe();
              if (_this10._scheduler != null && cancellationToken != null) {
                _this10._scheduler.cancel(cancellationToken);
              }
            };
          }).subscribe({
            complete: function complete() {
              _this10._complete(id);
              decrementPendingCount();
            },
            error: function error(_error4) {
              _this10._error(_error4);
              decrementPendingCount();
            },
            start: function start(subscription) {
              return _this10._start(id, subscription);
            }
          });
        }
        break;
      case 'ActorPayload':
        this._processFollowupPayloadWithNormalizationNode(followupPayload, followupPayload.node);
        break;
      default:
        followupPayload;
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Unexpected followup kind `%s`.', followupPayload.kind) : invariant(false) : void 0;
    }
  };
  _proto._processFollowupPayloadWithNormalizationNode = function _processFollowupPayloadWithNormalizationNode(followupPayload, normalizationNode) {
    this._handleFollowupPayload(followupPayload, normalizationNode);
    this._maybeCompleteSubscriptionOperationTracking();
  };
  _proto._handleFollowupPayload = function _handleFollowupPayload(followupPayload, normalizationNode) {
    var relayPayload = this._normalizeFollowupPayload(followupPayload, normalizationNode);
    this._getPublishQueueAndSaveActor().commitPayload(this._operation, relayPayload);
    this._processPayloadFollowups([relayPayload]);
  };
  _proto._processIncrementalPlaceholder = function _processIncrementalPlaceholder(relayPayload, placeholder) {
    var _relayPayload$fieldPa;
    var label = placeholder.label,
      path = placeholder.path;
    var pathKey = path.map(String).join('.');
    var resultForLabel = this._incrementalResults.get(label);
    if (resultForLabel == null) {
      resultForLabel = new Map();
      this._incrementalResults.set(label, resultForLabel);
    }
    var resultForPath = resultForLabel.get(pathKey);
    var pendingResponses = resultForPath != null && resultForPath.kind === 'response' ? resultForPath.responses : null;
    resultForLabel.set(pathKey, {
      kind: 'placeholder',
      placeholder: placeholder
    });
    var parentID;
    if (placeholder.kind === 'stream') {
      parentID = placeholder.parentID;
    } else if (placeholder.kind === 'defer') {
      parentID = placeholder.selector.dataID;
    } else {
      placeholder;
      !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Unsupported incremental placeholder kind `%s`.', placeholder.kind) : invariant(false) : void 0;
    }
    var parentRecord = relayPayload.source.get(parentID);
    var parentPayloads = ((_relayPayload$fieldPa = relayPayload.fieldPayloads) !== null && _relayPayload$fieldPa !== void 0 ? _relayPayload$fieldPa : []).filter(function (fieldPayload) {
      var fieldID = generateClientID(fieldPayload.dataID, fieldPayload.fieldKey);
      return fieldPayload.dataID === parentID || fieldID === parentID;
    });
    !(parentRecord != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected record `%s` to exist.', parentID) : invariant(false) : void 0;
    var nextParentRecord;
    var nextParentPayloads;
    var previousParentEntry = this._source.get(parentID);
    if (previousParentEntry != null) {
      nextParentRecord = RelayModernRecord.update(previousParentEntry.record, parentRecord);
      var handlePayloads = new Map();
      var dedupePayload = function dedupePayload(payload) {
        var key = stableStringify(payload);
        handlePayloads.set(key, payload);
      };
      previousParentEntry.fieldPayloads.forEach(dedupePayload);
      parentPayloads.forEach(dedupePayload);
      nextParentPayloads = Array.from(handlePayloads.values());
    } else {
      nextParentRecord = parentRecord;
      nextParentPayloads = parentPayloads;
    }
    this._source.set(parentID, {
      record: nextParentRecord,
      fieldPayloads: nextParentPayloads
    });
    if (pendingResponses != null) {
      var payloadFollowups = this._processIncrementalResponses(pendingResponses);
      this._processPayloadFollowups(payloadFollowups);
    }
  };
  _proto._processIncrementalResponses = function _processIncrementalResponses(incrementalResponses) {
    var _this11 = this;
    var relayPayloads = [];
    incrementalResponses.forEach(function (incrementalResponse) {
      var label = incrementalResponse.label,
        path = incrementalResponse.path,
        response = incrementalResponse.response;
      var resultForLabel = _this11._incrementalResults.get(label);
      if (resultForLabel == null) {
        resultForLabel = new Map();
        _this11._incrementalResults.set(label, resultForLabel);
      }
      if (label.indexOf('$defer$') !== -1) {
        var pathKey = path.map(String).join('.');
        var resultForPath = resultForLabel.get(pathKey);
        if (resultForPath == null) {
          resultForPath = {
            kind: 'response',
            responses: [incrementalResponse]
          };
          resultForLabel.set(pathKey, resultForPath);
          return;
        } else if (resultForPath.kind === 'response') {
          resultForPath.responses.push(incrementalResponse);
          return;
        }
        var placeholder = resultForPath.placeholder;
        !(placeholder.kind === 'defer') ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected data for path `%s` for label `%s` ' + 'to be data for @defer, was `@%s`.', pathKey, label, placeholder.kind) : invariant(false) : void 0;
        relayPayloads.push(_this11._processDeferResponse(label, path, placeholder, response));
      } else {
        var _pathKey = path.slice(0, -2).map(String).join('.');
        var _resultForPath = resultForLabel.get(_pathKey);
        if (_resultForPath == null) {
          _resultForPath = {
            kind: 'response',
            responses: [incrementalResponse]
          };
          resultForLabel.set(_pathKey, _resultForPath);
          return;
        } else if (_resultForPath.kind === 'response') {
          _resultForPath.responses.push(incrementalResponse);
          return;
        }
        var _placeholder = _resultForPath.placeholder;
        !(_placeholder.kind === 'stream') ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected data for path `%s` for label `%s` ' + 'to be data for @stream, was `@%s`.', _pathKey, label, _placeholder.kind) : invariant(false) : void 0;
        relayPayloads.push(_this11._processStreamResponse(label, path, _placeholder, response));
      }
    });
    return relayPayloads;
  };
  _proto._processDeferResponse = function _processDeferResponse(label, path, placeholder, response) {
    var _placeholder$actorIde;
    var parentID = placeholder.selector.dataID;
    var prevActorIdentifier = this._actorIdentifier;
    this._actorIdentifier = (_placeholder$actorIde = placeholder.actorIdentifier) !== null && _placeholder$actorIde !== void 0 ? _placeholder$actorIde : this._actorIdentifier;
    var relayPayload = this._normalizeResponse(response, placeholder.selector, placeholder.typeName, {
      actorIdentifier: this._actorIdentifier,
      getDataID: this._getDataID,
      path: placeholder.path,
      treatMissingFieldsAsNull: this._treatMissingFieldsAsNull,
      shouldProcessClientComponents: this._shouldProcessClientComponents
    });
    this._getPublishQueueAndSaveActor().commitPayload(this._operation, relayPayload);
    var parentEntry = this._source.get(parentID);
    !(parentEntry != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected the parent record `%s` for @defer ' + 'data to exist.', parentID) : invariant(false) : void 0;
    var fieldPayloads = parentEntry.fieldPayloads;
    if (fieldPayloads.length !== 0) {
      var _response$extensions2;
      var handleFieldsRelayPayload = {
        errors: null,
        fieldPayloads: fieldPayloads,
        incrementalPlaceholders: null,
        followupPayloads: null,
        source: RelayRecordSource.create(),
        isFinal: ((_response$extensions2 = response.extensions) === null || _response$extensions2 === void 0 ? void 0 : _response$extensions2.is_final) === true
      };
      this._getPublishQueueAndSaveActor().commitPayload(this._operation, handleFieldsRelayPayload);
    }
    this._actorIdentifier = prevActorIdentifier;
    return relayPayload;
  };
  _proto._processStreamResponse = function _processStreamResponse(label, path, placeholder, response) {
    var parentID = placeholder.parentID,
      node = placeholder.node,
      variables = placeholder.variables,
      actorIdentifier = placeholder.actorIdentifier;
    var prevActorIdentifier = this._actorIdentifier;
    this._actorIdentifier = actorIdentifier !== null && actorIdentifier !== void 0 ? actorIdentifier : this._actorIdentifier;
    var field = node.selections[0];
    !(field != null && field.kind === 'LinkedField' && field.plural === true) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected @stream to be used on a plural field.') : invariant(false) : void 0;
    var _this$_normalizeStrea = this._normalizeStreamItem(response, parentID, field, variables, path, placeholder.path),
      fieldPayloads = _this$_normalizeStrea.fieldPayloads,
      itemID = _this$_normalizeStrea.itemID,
      itemIndex = _this$_normalizeStrea.itemIndex,
      prevIDs = _this$_normalizeStrea.prevIDs,
      relayPayload = _this$_normalizeStrea.relayPayload,
      storageKey = _this$_normalizeStrea.storageKey;
    this._getPublishQueueAndSaveActor().commitPayload(this._operation, relayPayload, function (store) {
      var currentParentRecord = store.get(parentID);
      if (currentParentRecord == null) {
        return;
      }
      var currentItems = currentParentRecord.getLinkedRecords(storageKey);
      if (currentItems == null) {
        return;
      }
      if (currentItems.length !== prevIDs.length || currentItems.some(function (currentItem, index) {
        return prevIDs[index] !== (currentItem && currentItem.getDataID());
      })) {
        return;
      }
      var nextItems = (0, _toConsumableArray2["default"])(currentItems);
      nextItems[itemIndex] = store.get(itemID);
      currentParentRecord.setLinkedRecords(nextItems, storageKey);
    });
    if (fieldPayloads.length !== 0) {
      var handleFieldsRelayPayload = {
        errors: null,
        fieldPayloads: fieldPayloads,
        incrementalPlaceholders: null,
        followupPayloads: null,
        source: RelayRecordSource.create(),
        isFinal: false
      };
      this._getPublishQueueAndSaveActor().commitPayload(this._operation, handleFieldsRelayPayload);
    }
    this._actorIdentifier = prevActorIdentifier;
    return relayPayload;
  };
  _proto._normalizeStreamItem = function _normalizeStreamItem(response, parentID, field, variables, path, normalizationPath) {
    var _field$alias, _field$concreteType, _ref, _this$_getDataID;
    var data = response.data;
    !(typeof data === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected the GraphQL @stream payload `data` ' + 'value to be an object.') : invariant(false) : void 0;
    var responseKey = (_field$alias = field.alias) !== null && _field$alias !== void 0 ? _field$alias : field.name;
    var storageKey = getStorageKey(field, variables);
    var parentEntry = this._source.get(parentID);
    !(parentEntry != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected the parent record `%s` for @stream ' + 'data to exist.', parentID) : invariant(false) : void 0;
    var parentRecord = parentEntry.record,
      fieldPayloads = parentEntry.fieldPayloads;
    var prevIDs = RelayModernRecord.getLinkedRecordIDs(parentRecord, storageKey);
    !(prevIDs != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected record `%s` to have fetched field ' + '`%s` with @stream.', parentID, field.name) : invariant(false) : void 0;
    var finalPathEntry = path[path.length - 1];
    var itemIndex = parseInt(finalPathEntry, 10);
    !(itemIndex === finalPathEntry && itemIndex >= 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected path for @stream to end in a ' + 'positive integer index, got `%s`', finalPathEntry) : invariant(false) : void 0;
    var typeName = (_field$concreteType = field.concreteType) !== null && _field$concreteType !== void 0 ? _field$concreteType : data[TYPENAME_KEY];
    !(typeof typeName === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected @stream field `%s` to have a ' + '__typename.', field.name) : invariant(false) : void 0;
    var itemID = (_ref = (_this$_getDataID = this._getDataID(data, typeName)) !== null && _this$_getDataID !== void 0 ? _this$_getDataID : prevIDs === null || prevIDs === void 0 ? void 0 : prevIDs[itemIndex]) !== null && _ref !== void 0 ? _ref : generateClientID(parentID, storageKey, itemIndex);
    !(typeof itemID === 'string') ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected id of elements of field `%s` to ' + 'be strings.', storageKey) : invariant(false) : void 0;
    var selector = createNormalizationSelector(field, itemID, variables);
    var nextParentRecord = RelayModernRecord.clone(parentRecord);
    var nextIDs = (0, _toConsumableArray2["default"])(prevIDs);
    nextIDs[itemIndex] = itemID;
    RelayModernRecord.setLinkedRecordIDs(nextParentRecord, storageKey, nextIDs);
    this._source.set(parentID, {
      record: nextParentRecord,
      fieldPayloads: fieldPayloads
    });
    var relayPayload = this._normalizeResponse(response, selector, typeName, {
      actorIdentifier: this._actorIdentifier,
      getDataID: this._getDataID,
      path: [].concat((0, _toConsumableArray2["default"])(normalizationPath), [responseKey, String(itemIndex)]),
      treatMissingFieldsAsNull: this._treatMissingFieldsAsNull,
      shouldProcessClientComponents: this._shouldProcessClientComponents
    });
    return {
      fieldPayloads: fieldPayloads,
      itemID: itemID,
      itemIndex: itemIndex,
      prevIDs: prevIDs,
      relayPayload: relayPayload,
      storageKey: storageKey
    };
  };
  _proto._scheduleAsyncStoreUpdate = function _scheduleAsyncStoreUpdate(scheduleFn, completeFn) {
    var _this12 = this;
    this._completeFns.push(completeFn);
    if (this._asyncStoreUpdateDisposable != null) {
      return;
    }
    this._asyncStoreUpdateDisposable = scheduleFn(function () {
      _this12._asyncStoreUpdateDisposable = null;
      var updatedOwners = _this12._runPublishQueue();
      _this12._updateOperationTracker(updatedOwners);
      var _iterator2 = (0, _createForOfIteratorHelper2["default"])(_this12._completeFns),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var complete = _step2.value;
          complete();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      _this12._completeFns = [];
    });
  };
  _proto._updateOperationTracker = function _updateOperationTracker(updatedOwners) {
    if (updatedOwners != null && updatedOwners.length > 0) {
      this._operationTracker.update(this._operation.request, new Set(updatedOwners));
    }
  };
  _proto._completeOperationTracker = function _completeOperationTracker() {
    this._operationTracker.complete(this._operation.request);
  };
  _proto._getPublishQueueAndSaveActor = function _getPublishQueueAndSaveActor() {
    this._seenActors.add(this._actorIdentifier);
    return this._getPublishQueue(this._actorIdentifier);
  };
  _proto._getActorsToVisit = function _getActorsToVisit() {
    if (this._seenActors.size === 0) {
      return new Set([this._actorIdentifier]);
    } else {
      return this._seenActors;
    }
  };
  _proto._runPublishQueue = function _runPublishQueue(operation) {
    var updatedOwners = new Set();
    var _iterator3 = (0, _createForOfIteratorHelper2["default"])(this._getActorsToVisit()),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var actorIdentifier = _step3.value;
        var owners = this._getPublishQueue(actorIdentifier).run(operation);
        owners.forEach(function (owner) {
          return updatedOwners.add(owner);
        });
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return Array.from(updatedOwners);
  };
  _proto._retainData = function _retainData() {
    var _iterator4 = (0, _createForOfIteratorHelper2["default"])(this._getActorsToVisit()),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var actorIdentifier = _step4.value;
        if (!this._retainDisposables.has(actorIdentifier)) {
          this._retainDisposables.set(actorIdentifier, this._getStore(actorIdentifier).retain(this._operation));
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  };
  _proto._disposeRetainedData = function _disposeRetainedData() {
    var _iterator5 = (0, _createForOfIteratorHelper2["default"])(this._retainDisposables.values()),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var disposable = _step5.value;
        disposable.dispose();
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    this._retainDisposables.clear();
  };
  _proto._expectOperationLoader = function _expectOperationLoader() {
    var operationLoader = this._operationLoader;
    !operationLoader ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: Expected an operationLoader to be ' + 'configured when using `@match`.') : invariant(false) : void 0;
    return operationLoader;
  };
  return Executor;
}();
function partitionGraphQLResponses(responses) {
  var nonIncrementalResponses = [];
  var incrementalResponses = [];
  responses.forEach(function (response) {
    if (response.path != null || response.label != null) {
      var label = response.label,
        path = response.path;
      if (label == null || path == null) {
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: invalid incremental payload, expected ' + '`path` and `label` to either both be null/undefined, or ' + '`path` to be an `Array<string | number>` and `label` to be a ' + '`string`.') : invariant(false) : void 0;
      }
      incrementalResponses.push({
        label: label,
        path: path,
        response: response
      });
    } else {
      nonIncrementalResponses.push(response);
    }
  });
  return [nonIncrementalResponses, incrementalResponses];
}
function stableStringify(value) {
  var _JSON$stringify;
  return (_JSON$stringify = JSON.stringify(stableCopy(value))) !== null && _JSON$stringify !== void 0 ? _JSON$stringify : '';
}
function validateOptimisticResponsePayload(payload) {
  var incrementalPlaceholders = payload.incrementalPlaceholders;
  if (incrementalPlaceholders != null && incrementalPlaceholders.length !== 0) {
    !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'OperationExecutor: optimistic responses cannot be returned ' + 'for operations that use incremental data delivery (@defer, ' + '@stream, and @stream_connection).') : invariant(false) : void 0;
  }
}
module.exports = {
  execute: execute
};