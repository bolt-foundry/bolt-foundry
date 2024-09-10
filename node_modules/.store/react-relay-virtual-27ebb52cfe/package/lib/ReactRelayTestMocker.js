'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var areEqual = require("fbjs/lib/areEqual");
var invariant = require('invariant');
var _require = require('relay-runtime'),
  Network = _require.Network,
  createOperationDescriptor = _require.createOperationDescriptor,
  isRelayModernEnvironment = _require.isRelayModernEnvironment;
var warning = require("fbjs/lib/warning");
var nextId = 0;
var ReactRelayTestMocker = /*#__PURE__*/function () {
  function ReactRelayTestMocker(env) {
    (0, _defineProperty2["default"])(this, "_defaults", {});
    (0, _defineProperty2["default"])(this, "_pendingFetches", []);
    if (isRelayModernEnvironment(env)) {
      this._mockNetworkLayer(env);
    } else {
      process.env.NODE_ENV !== "production" ? warning(false, 'Network mocking is currently only supported in Relay Modern. ' + 'You will not be able to resolve requests made with Relay ' + 'Classic environments.') : void 0;
    }
    this._environment = env;
  }
  ReactRelayTestMocker.mockOutEnvironment = function mockOutEnvironment(env) {
    return new ReactRelayTestMocker(env);
  };
  ReactRelayTestMocker.generateId = function generateId() {
    var toRet = nextId.toString();
    nextId++;
    return toRet;
  };
  ReactRelayTestMocker.getIdentifier = function getIdentifier(request) {
    return request.name;
  };
  ReactRelayTestMocker.stripUnused = function stripUnused(variables) {
    if (variables.input) {
      var toRemove = ['client_mutation_id', 'actor_id', 'clientMutationId', 'actorId'];
      var strippedVariables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, variables), {}, {
        input: (0, _objectSpread2["default"])({}, variables.input)
      });
      toRemove.forEach(function (item) {
        return strippedVariables.input[item] = undefined;
      });
      return strippedVariables;
    }
    return variables;
  };
  var _proto = ReactRelayTestMocker.prototype;
  _proto._mockNetworkLayer = function _mockNetworkLayer(env) {
    var _this = this;
    var fetch = function fetch(request, variables, cacheConfig) {
      var resolve;
      var reject;
      var promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
      });
      var strippedVars = ReactRelayTestMocker.stripUnused(variables);
      var ident = ReactRelayTestMocker.getIdentifier(request);
      if (_this._defaults[ident]) {
        var payload = _this._defaults[ident];
        return typeof payload === 'function' ? payload(strippedVars) : payload;
      }
      _this._pendingFetches.push({
        ident: ident,
        cacheConfig: cacheConfig,
        deferred: {
          resolve: resolve,
          reject: reject
        },
        request: request,
        variables: strippedVars
      });
      return promise;
    };
    var isLoading = function isLoading(ident) {
      return _this._pendingFetches.some(function (pending) {
        return pending.ident === ident;
      });
    };
    var resolveRawQuery = function resolveRawQuery(toResolve, payload) {
      _this._pendingFetches = _this._pendingFetches.filter(function (pending) {
        return pending !== toResolve;
      });
      var deferred = toResolve.deferred;
      deferred.resolve(payload);
    };
    var rejectQuery = function rejectQuery(toResolve, payload) {
      _this._pendingFetches = _this._pendingFetches.filter(function (pending) {
        return pending !== toResolve;
      });
      var deferred = toResolve.deferred;
      deferred.reject(payload.error);
    };
    env.mock = {
      isLoading: isLoading,
      rejectQuery: rejectQuery,
      resolveRawQuery: resolveRawQuery,
      fetch: fetch
    };
    env.hasMockedNetwork = true;
    env.__setNet(Network.create(fetch));
    return env;
  };
  _proto.setDefault = function setDefault(toSet) {
    var query = toSet.query,
      payload = toSet.payload;
    var ident = ReactRelayTestMocker.getIdentifier(query.params);
    this._defaults[ident] = payload;
  };
  _proto.unsetDefault = function unsetDefault(toUnset) {
    var query = toUnset.query;
    var ident = ReactRelayTestMocker.getIdentifier(query.params);
    delete this._defaults[ident];
  };
  _proto.dataWrite = function dataWrite(config) {
    var query = config.query,
      variables = config.variables,
      payload = config.payload;
    var operationDescriptor = createOperationDescriptor(query, variables);
    !(payload.data != null && payload.errors === undefined) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Only `data` can be written when using `writeDirect`. You may need to ' + 'wrap your payload in an object like `{data: payload}`.') : invariant(false) : void 0;
    this._environment.commitPayload(operationDescriptor, payload.data);
  };
  _proto.networkWrite = function networkWrite(config) {
    !this._environment.hasMockedNetwork ? process.env.NODE_ENV !== "production" ? invariant(false, 'You cannot resolve queries without a mocked environment. Did you mean ' + 'to use `writeDirect` instead?') : invariant(false) : void 0;
    var query = config.query,
      variables = config.variables,
      payload = config.payload;
    var ident = ReactRelayTestMocker.getIdentifier(query.params);
    var usedVars;
    if (variables) {
      var operationDescriptor = createOperationDescriptor(query, variables);
      usedVars = ReactRelayTestMocker.stripUnused(operationDescriptor.request.variables);
    }
    var toResolve;
    this._pendingFetches.forEach(function (pending) {
      var pendingVars = pending.variables;
      if (pending.ident === ident) {
        !(!toResolve || variables) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Multiple queries with the same name are currently pending. You ' + 'should pass variables to `write` so that it can determine which ' + 'to resolve') : invariant(false) : void 0;
        if (variables) {
          if (areEqual(pendingVars, usedVars)) {
            toResolve = pending;
          }
        } else {
          toResolve = pending;
        }
      }
    });
    var varMessage = usedVars ? ' - variables: ' + JSON.stringify(usedVars) : '';
    !toResolve ? process.env.NODE_ENV !== "production" ? invariant(false, 'You are attempting to resolve a query that has not been fetched ' + '(%s%s).\n\tPlease ensure you passed the correct variables, or use ' + '`writeDirect` instead.', ident, varMessage) : invariant(false) : void 0;
    var realPayload = typeof payload === 'function' ? payload(toResolve.variables) : payload;
    if (realPayload.errors != null && realPayload.errors.length > 0) {
      this._environment.mock.rejectQuery(toResolve, {
        error: realPayload.errors[0]
      });
    } else {
      this._environment.mock.resolveRawQuery(toResolve, realPayload);
    }
  };
  return ReactRelayTestMocker;
}();
module.exports = ReactRelayTestMocker;