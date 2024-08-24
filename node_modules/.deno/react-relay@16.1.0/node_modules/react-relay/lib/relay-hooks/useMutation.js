'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var useIsMountedRef = require('./useIsMountedRef');
var useRelayEnvironment = require('./useRelayEnvironment');
var React = require('react');
var _require = require('relay-runtime'),
  defaultCommitMutation = _require.commitMutation;
var useState = React.useState,
  useEffect = React.useEffect,
  useRef = React.useRef,
  useCallback = React.useCallback;
function useMutation(mutation) {
  var commitMutationFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultCommitMutation;
  var environment = useRelayEnvironment();
  var isMountedRef = useIsMountedRef();
  var environmentRef = useRef(environment);
  var mutationRef = useRef(mutation);
  var inFlightMutationsRef = useRef(new Set());
  var _useState = useState(false),
    isMutationInFlight = _useState[0],
    setMutationInFlight = _useState[1];
  var cleanup = useCallback(function (disposable) {
    if (environmentRef.current === environment && mutationRef.current === mutation) {
      inFlightMutationsRef.current["delete"](disposable);
      if (isMountedRef.current) {
        setMutationInFlight(inFlightMutationsRef.current.size > 0);
      }
    }
  }, [environment, isMountedRef, mutation]);
  useEffect(function () {
    if (environmentRef.current !== environment || mutationRef.current !== mutation) {
      inFlightMutationsRef.current = new Set();
      if (isMountedRef.current) {
        setMutationInFlight(false);
      }
      environmentRef.current = environment;
      mutationRef.current = mutation;
    }
  }, [environment, isMountedRef, mutation]);
  var commit = useCallback(function (config) {
    if (isMountedRef.current) {
      setMutationInFlight(true);
    }
    var disposable = commitMutationFn(environment, (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, config), {}, {
      mutation: mutation,
      onCompleted: function onCompleted(response, errors) {
        var _config$onCompleted;
        cleanup(disposable);
        (_config$onCompleted = config.onCompleted) === null || _config$onCompleted === void 0 ? void 0 : _config$onCompleted.call(config, response, errors);
      },
      onError: function onError(error) {
        var _config$onError;
        cleanup(disposable);
        (_config$onError = config.onError) === null || _config$onError === void 0 ? void 0 : _config$onError.call(config, error);
      },
      onUnsubscribe: function onUnsubscribe() {
        var _config$onUnsubscribe;
        cleanup(disposable);
        (_config$onUnsubscribe = config.onUnsubscribe) === null || _config$onUnsubscribe === void 0 ? void 0 : _config$onUnsubscribe.call(config);
      },
      onNext: function onNext() {
        var _config$onNext;
        (_config$onNext = config.onNext) === null || _config$onNext === void 0 ? void 0 : _config$onNext.call(config);
      }
    }));
    inFlightMutationsRef.current.add(disposable);
    return disposable;
  }, [cleanup, commitMutationFn, environment, isMountedRef, mutation]);
  return [commit, isMutationInFlight];
}
module.exports = useMutation;