'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var ProfilerContext = require('../ProfilerContext');
var _require = require('../QueryResource'),
  getQueryResourceForEnvironment = _require.getQueryResourceForEnvironment;
var useIsMountedRef = require('../useIsMountedRef');
var useQueryLoader = require('../useQueryLoader');
var useRelayEnvironment = require('../useRelayEnvironment');
var _require2 = require('./FragmentResource'),
  getFragmentResourceForEnvironment = _require2.getFragmentResourceForEnvironment;
var useFragmentNode = require('./useFragmentNode');
var invariant = require('invariant');
var _require3 = require('react'),
  useCallback = _require3.useCallback,
  useContext = _require3.useContext,
  useReducer = _require3.useReducer;
var _require4 = require('relay-runtime'),
  fetchQuery = _require4.__internal.fetchQuery,
  createOperationDescriptor = _require4.createOperationDescriptor,
  getFragmentIdentifier = _require4.getFragmentIdentifier,
  getRefetchMetadata = _require4.getRefetchMetadata,
  getSelector = _require4.getSelector,
  getValueAtPath = _require4.getValueAtPath;
var warning = require("fbjs/lib/warning");
function reducer(state, action) {
  switch (action.type) {
    case 'refetch':
      {
        var _action$refetchEnviro;
        return (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, state), {}, {
          fetchPolicy: action.fetchPolicy,
          mirroredEnvironment: (_action$refetchEnviro = action.refetchEnvironment) !== null && _action$refetchEnviro !== void 0 ? _action$refetchEnviro : state.mirroredEnvironment,
          onComplete: action.onComplete,
          refetchEnvironment: action.refetchEnvironment,
          refetchQuery: action.refetchQuery,
          renderPolicy: action.renderPolicy
        });
      }
    case 'reset':
      {
        return {
          fetchPolicy: undefined,
          mirroredEnvironment: action.environment,
          mirroredFragmentIdentifier: action.fragmentIdentifier,
          onComplete: undefined,
          refetchQuery: null,
          renderPolicy: undefined
        };
      }
    default:
      {
        action.type;
        throw new Error('useRefetchableFragmentNode: Unexpected action type');
      }
  }
}
function useRefetchableFragmentNode(fragmentNode, parentFragmentRef, componentDisplayName) {
  var parentEnvironment = useRelayEnvironment();
  var _getRefetchMetadata = getRefetchMetadata(fragmentNode, componentDisplayName),
    refetchableRequest = _getRefetchMetadata.refetchableRequest,
    fragmentRefPathInResponse = _getRefetchMetadata.fragmentRefPathInResponse;
  var fragmentIdentifier = getFragmentIdentifier(fragmentNode, parentFragmentRef);
  var _useReducer = useReducer(reducer, {
      fetchPolicy: undefined,
      mirroredEnvironment: parentEnvironment,
      mirroredFragmentIdentifier: fragmentIdentifier,
      onComplete: undefined,
      refetchEnvironment: null,
      refetchQuery: null,
      renderPolicy: undefined
    }),
    refetchState = _useReducer[0],
    dispatch = _useReducer[1];
  var fetchPolicy = refetchState.fetchPolicy,
    mirroredEnvironment = refetchState.mirroredEnvironment,
    mirroredFragmentIdentifier = refetchState.mirroredFragmentIdentifier,
    onComplete = refetchState.onComplete,
    refetchEnvironment = refetchState.refetchEnvironment,
    refetchQuery = refetchState.refetchQuery,
    renderPolicy = refetchState.renderPolicy;
  var environment = refetchEnvironment !== null && refetchEnvironment !== void 0 ? refetchEnvironment : parentEnvironment;
  var QueryResource = getQueryResourceForEnvironment(environment);
  var FragmentResource = getFragmentResourceForEnvironment(environment);
  var profilerContext = useContext(ProfilerContext);
  var shouldReset = environment !== mirroredEnvironment || fragmentIdentifier !== mirroredFragmentIdentifier;
  var _useQueryLoader = useQueryLoader(refetchableRequest),
    queryRef = _useQueryLoader[0],
    loadQuery = _useQueryLoader[1],
    disposeQuery = _useQueryLoader[2];
  var fragmentRef = parentFragmentRef;
  var _getRefetchMetadata2 = getRefetchMetadata(fragmentNode, componentDisplayName),
    identifierInfo = _getRefetchMetadata2.identifierInfo;
  if (shouldReset) {
    dispatch({
      type: 'reset',
      environment: environment,
      fragmentIdentifier: fragmentIdentifier
    });
    disposeQuery();
  } else if (refetchQuery != null && queryRef != null) {
    var debugPreviousIDAndTypename;
    if (process.env.NODE_ENV !== "production") {
      debugPreviousIDAndTypename = debugFunctions.getInitialIDAndType(refetchQuery.request.variables, fragmentRefPathInResponse, identifierInfo === null || identifierInfo === void 0 ? void 0 : identifierInfo.identifierQueryVariableName, environment);
    }
    var handleQueryCompleted = function handleQueryCompleted(maybeError) {
      onComplete && onComplete(maybeError !== null && maybeError !== void 0 ? maybeError : null);
    };
    var fetchObservable = queryRef.source != null ? queryRef.source : fetchQuery(environment, refetchQuery);
    var queryResult = profilerContext.wrapPrepareQueryResource(function () {
      return QueryResource.prepare(refetchQuery, fetchObservable, fetchPolicy, renderPolicy, {
        error: handleQueryCompleted,
        complete: function complete() {
          if (process.env.NODE_ENV !== "production") {
            debugFunctions.checkSameTypeAfterRefetch(debugPreviousIDAndTypename, environment, fragmentNode, componentDisplayName);
          }
          handleQueryCompleted();
        }
      }, queryRef.fetchKey, profilerContext);
    });
    var queryData = FragmentResource.read(queryResult.fragmentNode, queryResult.fragmentRef, componentDisplayName).data;
    !(queryData != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to be able to read refetch query response. ' + "If you're seeing this, this is likely a bug in Relay.") : invariant(false) : void 0;
    var refetchedFragmentRef = getValueAtPath(queryData, fragmentRefPathInResponse);
    fragmentRef = refetchedFragmentRef;
    if (process.env.NODE_ENV !== "production") {
      debugFunctions.checkSameIDAfterRefetch(debugPreviousIDAndTypename, fragmentRef, fragmentNode, componentDisplayName);
    }
  }
  var _useFragmentNode = useFragmentNode(fragmentNode, fragmentRef, componentDisplayName),
    fragmentData = _useFragmentNode.data,
    disableStoreUpdates = _useFragmentNode.disableStoreUpdates,
    enableStoreUpdates = _useFragmentNode.enableStoreUpdates;
  var refetch = useRefetchFunction(componentDisplayName, dispatch, disposeQuery, fragmentData, fragmentIdentifier, fragmentNode, fragmentRefPathInResponse, identifierInfo, loadQuery, parentFragmentRef, refetchableRequest);
  return {
    fragmentData: fragmentData,
    fragmentRef: fragmentRef,
    refetch: refetch,
    disableStoreUpdates: disableStoreUpdates,
    enableStoreUpdates: enableStoreUpdates
  };
}
function useRefetchFunction(componentDisplayName, dispatch, disposeQuery, fragmentData, fragmentIdentifier, fragmentNode, fragmentRefPathInResponse, identifierInfo, loadQuery, parentFragmentRef, refetchableRequest) {
  var isMountedRef = useIsMountedRef();
  var identifierValue = (identifierInfo === null || identifierInfo === void 0 ? void 0 : identifierInfo.identifierField) != null && fragmentData != null && typeof fragmentData === 'object' ? fragmentData[identifierInfo.identifierField] : null;
  return useCallback(function (providedRefetchVariables, options) {
    if (isMountedRef.current !== true) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Unexpected call to `refetch` on unmounted component for fragment ' + '`%s` in `%s`. It looks like some instances of your component are ' + 'still trying to fetch data but they already unmounted. ' + 'Please make sure you clear all timers, intervals, ' + 'async calls, etc that may trigger a fetch.', fragmentNode.name, componentDisplayName) : void 0;
      return {
        dispose: function dispose() {}
      };
    }
    if (parentFragmentRef == null) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Unexpected call to `refetch` while using a null fragment ref ' + 'for fragment `%s` in `%s`. When calling `refetch`, we expect ' + "initial fragment data to be non-null. Please make sure you're " + 'passing a valid fragment ref to `%s` before calling ' + '`refetch`, or make sure you pass all required variables to `refetch`.', fragmentNode.name, componentDisplayName, componentDisplayName) : void 0;
    }
    var refetchEnvironment = options === null || options === void 0 ? void 0 : options.__environment;
    var fetchPolicy = options === null || options === void 0 ? void 0 : options.fetchPolicy;
    var renderPolicy = options === null || options === void 0 ? void 0 : options.UNSTABLE_renderPolicy;
    var onComplete = options === null || options === void 0 ? void 0 : options.onComplete;
    var fragmentSelector = getSelector(fragmentNode, parentFragmentRef);
    var parentVariables;
    var fragmentVariables;
    if (fragmentSelector == null) {
      parentVariables = {};
      fragmentVariables = {};
    } else if (fragmentSelector.kind === 'PluralReaderSelector') {
      var _fragmentSelector$sel, _fragmentSelector$sel2, _fragmentSelector$sel3, _fragmentSelector$sel4;
      parentVariables = (_fragmentSelector$sel = (_fragmentSelector$sel2 = fragmentSelector.selectors[0]) === null || _fragmentSelector$sel2 === void 0 ? void 0 : _fragmentSelector$sel2.owner.variables) !== null && _fragmentSelector$sel !== void 0 ? _fragmentSelector$sel : {};
      fragmentVariables = (_fragmentSelector$sel3 = (_fragmentSelector$sel4 = fragmentSelector.selectors[0]) === null || _fragmentSelector$sel4 === void 0 ? void 0 : _fragmentSelector$sel4.variables) !== null && _fragmentSelector$sel3 !== void 0 ? _fragmentSelector$sel3 : {};
    } else {
      parentVariables = fragmentSelector.owner.variables;
      fragmentVariables = fragmentSelector.variables;
    }
    var refetchVariables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, parentVariables), fragmentVariables), providedRefetchVariables);
    if (identifierInfo != null && !providedRefetchVariables.hasOwnProperty(identifierInfo.identifierQueryVariableName)) {
      if (typeof identifierValue !== 'string') {
        process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Expected result to have a string  ' + '`%s` in order to refetch, got `%s`.', identifierInfo.identifierField, identifierValue) : void 0;
      }
      refetchVariables[identifierInfo.identifierQueryVariableName] = identifierValue;
    }
    var refetchQuery = createOperationDescriptor(refetchableRequest, refetchVariables, {
      force: true
    });
    loadQuery(refetchQuery.request.variables, {
      fetchPolicy: fetchPolicy,
      __environment: refetchEnvironment,
      __nameForWarning: 'refetch'
    });
    dispatch({
      type: 'refetch',
      fetchPolicy: fetchPolicy,
      onComplete: onComplete,
      refetchEnvironment: refetchEnvironment,
      refetchQuery: refetchQuery,
      renderPolicy: renderPolicy
    });
    return {
      dispose: disposeQuery
    };
  }, [fragmentIdentifier, dispatch, disposeQuery, identifierValue, loadQuery]);
}
var debugFunctions;
if (process.env.NODE_ENV !== "production") {
  debugFunctions = {
    getInitialIDAndType: function getInitialIDAndType(memoRefetchVariables, fragmentRefPathInResponse, identifierQueryVariableName, environment) {
      var _require5 = require('relay-runtime'),
        Record = _require5.Record;
      var id = memoRefetchVariables === null || memoRefetchVariables === void 0 ? void 0 : memoRefetchVariables[identifierQueryVariableName !== null && identifierQueryVariableName !== void 0 ? identifierQueryVariableName : 'id'];
      if (fragmentRefPathInResponse.length !== 1 || fragmentRefPathInResponse[0] !== 'node' || id == null) {
        return null;
      }
      var recordSource = environment.getStore().getSource();
      var record = recordSource.get(id);
      var typename = record == null ? null : Record.getType(record);
      if (typename == null) {
        return null;
      }
      return {
        id: id,
        typename: typename
      };
    },
    checkSameTypeAfterRefetch: function checkSameTypeAfterRefetch(previousIDAndType, environment, fragmentNode, componentDisplayName) {
      var _require6 = require('relay-runtime'),
        Record = _require6.Record;
      if (!previousIDAndType) {
        return;
      }
      var recordSource = environment.getStore().getSource();
      var record = recordSource.get(previousIDAndType.id);
      var typename = record && Record.getType(record);
      if (typename !== previousIDAndType.typename) {
        process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Call to `refetch` returned data with a different ' + '__typename: was `%s`, now `%s`, on `%s` in `%s`. ' + 'Please make sure the server correctly implements' + 'unique id requirement.', previousIDAndType.typename, typename, fragmentNode.name, componentDisplayName) : void 0;
      }
    },
    checkSameIDAfterRefetch: function checkSameIDAfterRefetch(previousIDAndTypename, refetchedFragmentRef, fragmentNode, componentDisplayName) {
      if (previousIDAndTypename == null) {
        return;
      }
      var _require7 = require('relay-runtime'),
        ID_KEY = _require7.ID_KEY;
      var resultID = refetchedFragmentRef[ID_KEY];
      if (resultID != null && resultID !== previousIDAndTypename.id) {
        process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Call to `refetch` returned a different id, expected ' + '`%s`, got `%s`, on `%s` in `%s`. ' + 'Please make sure the server correctly implements ' + 'unique id requirement.', resultID, previousIDAndTypename.id, fragmentNode.name, componentDisplayName) : void 0;
      }
    }
  };
}
module.exports = useRefetchableFragmentNode;