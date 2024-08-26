'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _require = require('../QueryResource'),
  getQueryResourceForEnvironment = _require.getQueryResourceForEnvironment;
var useRelayEnvironment = require('../useRelayEnvironment');
var invariant = require('invariant');
var _require2 = require('react'),
  useDebugValue = _require2.useDebugValue,
  useEffect = _require2.useEffect,
  useMemo = _require2.useMemo,
  useRef = _require2.useRef,
  useState = _require2.useState;
var _require3 = require('relay-runtime'),
  fetchQueryInternal = _require3.__internal.fetchQuery,
  RelayFeatureFlags = _require3.RelayFeatureFlags,
  areEqualSelectors = _require3.areEqualSelectors,
  createOperationDescriptor = _require3.createOperationDescriptor,
  getPendingOperationsForFragment = _require3.getPendingOperationsForFragment,
  getSelector = _require3.getSelector,
  getVariablesFromFragment = _require3.getVariablesFromFragment,
  handlePotentialSnapshotErrors = _require3.handlePotentialSnapshotErrors,
  recycleNodesInto = _require3.recycleNodesInto;
var warning = require("fbjs/lib/warning");
function isMissingData(state) {
  if (state.kind === 'bailout') {
    return false;
  } else if (state.kind === 'singular') {
    return state.snapshot.isMissingData;
  } else {
    return state.snapshots.some(function (s) {
      return s.isMissingData;
    });
  }
}
function getMissingClientEdges(state) {
  if (state.kind === 'bailout') {
    return null;
  } else if (state.kind === 'singular') {
    var _state$snapshot$missi;
    return (_state$snapshot$missi = state.snapshot.missingClientEdges) !== null && _state$snapshot$missi !== void 0 ? _state$snapshot$missi : null;
  } else {
    var edges = null;
    var _iterator = (0, _createForOfIteratorHelper2["default"])(state.snapshots),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var snapshot = _step.value;
        if (snapshot.missingClientEdges) {
          var _edges;
          edges = (_edges = edges) !== null && _edges !== void 0 ? _edges : [];
          var _iterator2 = (0, _createForOfIteratorHelper2["default"])(snapshot.missingClientEdges),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var edge = _step2.value;
              edges.push(edge);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return edges;
  }
}
function getSuspendingLiveResolver(state) {
  if (state.kind === 'bailout') {
    return null;
  } else if (state.kind === 'singular') {
    var _state$snapshot$missi2;
    return (_state$snapshot$missi2 = state.snapshot.missingLiveResolverFields) !== null && _state$snapshot$missi2 !== void 0 ? _state$snapshot$missi2 : null;
  } else {
    var missingFields = null;
    var _iterator3 = (0, _createForOfIteratorHelper2["default"])(state.snapshots),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var snapshot = _step3.value;
        if (snapshot.missingLiveResolverFields) {
          var _missingFields;
          missingFields = (_missingFields = missingFields) !== null && _missingFields !== void 0 ? _missingFields : [];
          var _iterator4 = (0, _createForOfIteratorHelper2["default"])(snapshot.missingLiveResolverFields),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var edge = _step4.value;
              missingFields.push(edge);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return missingFields;
  }
}
function handlePotentialSnapshotErrorsForState(environment, state) {
  if (state.kind === 'singular') {
    handlePotentialSnapshotErrors(environment, state.snapshot.missingRequiredFields, state.snapshot.relayResolverErrors);
  } else if (state.kind === 'plural') {
    var _iterator5 = (0, _createForOfIteratorHelper2["default"])(state.snapshots),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var snapshot = _step5.value;
        handlePotentialSnapshotErrors(environment, snapshot.missingRequiredFields, snapshot.relayResolverErrors);
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }
}
function handleMissedUpdates(environment, state) {
  if (state.kind === 'bailout') {
    return null;
  }
  var currentEpoch = environment.getStore().getEpoch();
  if (currentEpoch === state.epoch) {
    return null;
  }
  if (state.kind === 'singular') {
    var currentSnapshot = environment.lookup(state.snapshot.selector);
    var updatedData = recycleNodesInto(state.snapshot.data, currentSnapshot.data);
    var updatedCurrentSnapshot = {
      data: updatedData,
      isMissingData: currentSnapshot.isMissingData,
      missingClientEdges: currentSnapshot.missingClientEdges,
      missingLiveResolverFields: currentSnapshot.missingLiveResolverFields,
      seenRecords: currentSnapshot.seenRecords,
      selector: currentSnapshot.selector,
      missingRequiredFields: currentSnapshot.missingRequiredFields,
      relayResolverErrors: currentSnapshot.relayResolverErrors
    };
    return [updatedData !== state.snapshot.data, {
      kind: 'singular',
      snapshot: updatedCurrentSnapshot,
      epoch: currentEpoch
    }];
  } else {
    var didMissUpdates = false;
    var currentSnapshots = [];
    for (var index = 0; index < state.snapshots.length; index++) {
      var snapshot = state.snapshots[index];
      var _currentSnapshot = environment.lookup(snapshot.selector);
      var _updatedData = recycleNodesInto(snapshot.data, _currentSnapshot.data);
      var _updatedCurrentSnapshot = {
        data: _updatedData,
        isMissingData: _currentSnapshot.isMissingData,
        missingClientEdges: _currentSnapshot.missingClientEdges,
        missingLiveResolverFields: _currentSnapshot.missingLiveResolverFields,
        seenRecords: _currentSnapshot.seenRecords,
        selector: _currentSnapshot.selector,
        missingRequiredFields: _currentSnapshot.missingRequiredFields,
        relayResolverErrors: _currentSnapshot.relayResolverErrors
      };
      if (_updatedData !== snapshot.data) {
        didMissUpdates = true;
      }
      currentSnapshots.push(_updatedCurrentSnapshot);
    }
    !(currentSnapshots.length === state.snapshots.length) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected same number of snapshots') : invariant(false) : void 0;
    return [didMissUpdates, {
      kind: 'plural',
      snapshots: currentSnapshots,
      epoch: currentEpoch
    }];
  }
}
function handleMissingClientEdge(environment, parentFragmentNode, parentFragmentRef, missingClientEdgeRequestInfo, queryOptions) {
  var originalVariables = getVariablesFromFragment(parentFragmentNode, parentFragmentRef);
  var variables = (0, _objectSpread2["default"])((0, _objectSpread2["default"])({}, originalVariables), {}, {
    id: missingClientEdgeRequestInfo.clientEdgeDestinationID
  });
  var queryOperationDescriptor = createOperationDescriptor(missingClientEdgeRequestInfo.request, variables, queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.networkCacheConfig);
  var QueryResource = getQueryResourceForEnvironment(environment);
  return QueryResource.prepare(queryOperationDescriptor, fetchQueryInternal(environment, queryOperationDescriptor), queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.fetchPolicy);
}
function subscribeToSnapshot(environment, state, setState) {
  if (state.kind === 'bailout') {
    return function () {};
  } else if (state.kind === 'singular') {
    var disposable = environment.subscribe(state.snapshot, function (latestSnapshot) {
      setState(function (prevState) {
        if (prevState.kind !== 'singular' || prevState.snapshot.selector !== latestSnapshot.selector) {
          var updates = handleMissedUpdates(environment, prevState);
          if (updates != null) {
            var dataChanged = updates[0],
              nextState = updates[1];
            environment.__log({
              name: 'useFragment.subscription.missedUpdates',
              hasDataChanges: dataChanged
            });
            return dataChanged ? nextState : prevState;
          } else {
            return prevState;
          }
        }
        return {
          kind: 'singular',
          snapshot: latestSnapshot,
          epoch: environment.getStore().getEpoch()
        };
      });
    });
    return function () {
      disposable.dispose();
    };
  } else {
    var disposables = state.snapshots.map(function (snapshot, index) {
      return environment.subscribe(snapshot, function (latestSnapshot) {
        setState(function (prevState) {
          var _prevState$snapshots$;
          if (prevState.kind !== 'plural' || ((_prevState$snapshots$ = prevState.snapshots[index]) === null || _prevState$snapshots$ === void 0 ? void 0 : _prevState$snapshots$.selector) !== latestSnapshot.selector) {
            var updates = handleMissedUpdates(environment, prevState);
            if (updates != null) {
              var dataChanged = updates[0],
                nextState = updates[1];
              environment.__log({
                name: 'useFragment.subscription.missedUpdates',
                hasDataChanges: dataChanged
              });
              return dataChanged ? nextState : prevState;
            } else {
              return prevState;
            }
          }
          var updated = (0, _toConsumableArray2["default"])(prevState.snapshots);
          updated[index] = latestSnapshot;
          return {
            kind: 'plural',
            snapshots: updated,
            epoch: environment.getStore().getEpoch()
          };
        });
      });
    });
    return function () {
      var _iterator6 = (0, _createForOfIteratorHelper2["default"])(disposables),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var d = _step6.value;
          d.dispose();
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    };
  }
}
function getFragmentState(environment, fragmentSelector) {
  if (fragmentSelector == null) {
    return {
      kind: 'bailout'
    };
  } else if (fragmentSelector.kind === 'PluralReaderSelector') {
    return {
      kind: 'plural',
      snapshots: fragmentSelector.selectors.map(function (s) {
        return environment.lookup(s);
      }),
      epoch: environment.getStore().getEpoch()
    };
  } else {
    return {
      kind: 'singular',
      snapshot: environment.lookup(fragmentSelector),
      epoch: environment.getStore().getEpoch()
    };
  }
}
function useFragmentInternal_EXPERIMENTAL(fragmentNode, fragmentRef, hookDisplayName, queryOptions) {
  var _fragmentNode$metadat, _fragmentNode$metadat2;
  var fragmentSelector = useMemo(function () {
    return getSelector(fragmentNode, fragmentRef);
  }, [fragmentNode, fragmentRef]);
  var isPlural = (fragmentNode === null || fragmentNode === void 0 ? void 0 : (_fragmentNode$metadat = fragmentNode.metadata) === null || _fragmentNode$metadat === void 0 ? void 0 : _fragmentNode$metadat.plural) === true;
  if (isPlural) {
    !(fragmentRef == null || Array.isArray(fragmentRef)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected fragment pointer%s for fragment `%s` to be ' + 'an array, instead got `%s`. Remove `@relay(plural: true)` ' + 'from fragment `%s` to allow the prop to be an object.', fragmentNode.name, typeof fragmentRef, fragmentNode.name) : invariant(false) : void 0;
  } else {
    !!Array.isArray(fragmentRef) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected fragment pointer%s for fragment `%s` not to be ' + 'an array, instead got `%s`. Add `@relay(plural: true)` ' + 'to fragment `%s` to allow the prop to be an array.', fragmentNode.name, typeof fragmentRef, fragmentNode.name) : invariant(false) : void 0;
  }
  !(fragmentRef == null || isPlural && Array.isArray(fragmentRef) && fragmentRef.length === 0 || fragmentSelector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to receive an object where `...%s` was spread, ' + 'but the fragment reference was not found`. This is most ' + 'likely the result of:\n' + "- Forgetting to spread `%s` in `%s`'s parent's fragment.\n" + '- Conditionally fetching `%s` but unconditionally passing %s prop ' + 'to `%s`. If the parent fragment only fetches the fragment conditionally ' + '- with e.g. `@include`, `@skip`, or inside a `... on SomeType { }` ' + 'spread  - then the fragment reference will not exist. ' + 'In this case, pass `null` if the conditions for evaluating the ' + 'fragment are not met (e.g. if the `@include(if)` value is false.)', fragmentNode.name, fragmentNode.name, hookDisplayName, fragmentNode.name, hookDisplayName) : invariant(false) : void 0;
  var environment = useRelayEnvironment();
  var _useState = useState(function () {
      return getFragmentState(environment, fragmentSelector);
    }),
    _state = _useState[0],
    setState = _useState[1];
  var state = _state;
  var _useState2 = useState(state),
    _subscribedState = _useState2[0],
    setSubscribedState = _useState2[1];
  var subscribedState = _subscribedState;
  var _useState3 = useState(fragmentSelector),
    previousFragmentSelector = _useState3[0],
    setPreviousFragmentSelector = _useState3[1];
  var _useState4 = useState(environment),
    previousEnvironment = _useState4[0],
    setPreviousEnvironment = _useState4[1];
  if (!areEqualSelectors(fragmentSelector, previousFragmentSelector) || environment !== previousEnvironment) {
    setPreviousFragmentSelector(fragmentSelector);
    setPreviousEnvironment(environment);
    var newState = getFragmentState(environment, fragmentSelector);
    setState(newState);
    setSubscribedState(newState);
    state = newState;
    subscribedState = newState;
  }
  var committedFragmentSelectorRef = useRef(false);
  useEffect(function () {
    committedFragmentSelectorRef.current = fragmentSelector;
  }, [fragmentSelector]);
  if (((_fragmentNode$metadat2 = fragmentNode.metadata) === null || _fragmentNode$metadat2 === void 0 ? void 0 : _fragmentNode$metadat2.hasClientEdges) === true) {
    var clientEdgeQueries = useMemo(function () {
      var missingClientEdges = getMissingClientEdges(state);
      var clientEdgeQueries;
      if (missingClientEdges !== null && missingClientEdges !== void 0 && missingClientEdges.length) {
        clientEdgeQueries = [];
        var _iterator7 = (0, _createForOfIteratorHelper2["default"])(missingClientEdges),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var edge = _step7.value;
            clientEdgeQueries.push(handleMissingClientEdge(environment, fragmentNode, fragmentRef, edge, queryOptions));
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
      return clientEdgeQueries;
    }, [state, environment, fragmentNode, fragmentRef, queryOptions]);
    useEffect(function () {
      var QueryResource = getQueryResourceForEnvironment(environment);
      if (clientEdgeQueries !== null && clientEdgeQueries !== void 0 && clientEdgeQueries.length) {
        var disposables = [];
        var _iterator8 = (0, _createForOfIteratorHelper2["default"])(clientEdgeQueries),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var query = _step8.value;
            disposables.push(QueryResource.retain(query));
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
        return function () {
          var _iterator9 = (0, _createForOfIteratorHelper2["default"])(disposables),
            _step9;
          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var disposable = _step9.value;
              disposable.dispose();
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
        };
      }
    }, [environment, clientEdgeQueries]);
  }
  if (isMissingData(state)) {
    var suspendingLiveResolvers = getSuspendingLiveResolver(state);
    if (suspendingLiveResolvers != null && suspendingLiveResolvers.length > 0) {
      throw Promise.all(suspendingLiveResolvers.map(function (_ref) {
        var liveStateID = _ref.liveStateID;
        return environment.getStore().getLiveResolverPromise(liveStateID);
      }));
    }
    if (!committedFragmentSelectorRef.current || !areEqualSelectors(committedFragmentSelectorRef.current, fragmentSelector)) {
      !(fragmentSelector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'refinement, see invariants above') : invariant(false) : void 0;
      var fragmentOwner = fragmentSelector.kind === 'PluralReaderSelector' ? fragmentSelector.selectors[0].owner : fragmentSelector.owner;
      var pendingOperationsResult = getPendingOperationsForFragment(environment, fragmentNode, fragmentOwner);
      if (pendingOperationsResult) {
        throw pendingOperationsResult.promise;
      }
    }
  }
  handlePotentialSnapshotErrorsForState(environment, state);
  useEffect(function () {
    var currentState = subscribedState;
    var updates = handleMissedUpdates(environment, subscribedState);
    if (updates !== null) {
      var didMissUpdates = updates[0],
        updatedState = updates[1];
      if (didMissUpdates) {
        setState(updatedState);
      }
      currentState = updatedState;
    }
    return subscribeToSnapshot(environment, currentState, setState);
  }, [environment, subscribedState]);
  var data;
  if (isPlural) {
    var fragmentRefIsNullish = fragmentRef == null;
    data = useMemo(function () {
      if (state.kind === 'bailout') {
        return fragmentRefIsNullish ? null : [];
      } else {
        !(state.kind === 'plural') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected state to be plural because fragment is plural') : invariant(false) : void 0;
        return state.snapshots.map(function (s) {
          return s.data;
        });
      }
    }, [state, fragmentRefIsNullish]);
  } else if (state.kind === 'bailout') {
    data = null;
  } else {
    !(state.kind === 'singular') ? process.env.NODE_ENV !== "production" ? invariant(false, 'Expected state to be singular because fragment is singular') : invariant(false) : void 0;
    data = state.snapshot.data;
  }
  if (RelayFeatureFlags.LOG_MISSING_RECORDS_IN_PROD || process.env.NODE_ENV !== "production") {
    if (fragmentRef != null && (data === undefined || Array.isArray(data) && data.length > 0 && data.every(function (d) {
      return d === undefined;
    }))) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Expected to have been able to read non-null data for ' + 'fragment `%s` declared in ' + '`%s`, since fragment reference was non-null. ' + "Make sure that that `%s`'s parent isn't " + 'holding on to and/or passing a fragment reference for data that ' + 'has been deleted.', fragmentNode.name, hookDisplayName, hookDisplayName) : void 0;
    }
  }
  if (process.env.NODE_ENV !== "production") {
    useDebugValue({
      fragment: fragmentNode.name,
      data: data
    });
  }
  return data;
}
module.exports = useFragmentInternal_EXPERIMENTAL;