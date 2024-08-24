'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault")["default"];
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));
var _require = require('../QueryResource'),
  getQueryResourceForEnvironment = _require.getQueryResourceForEnvironment;
var invariant = require('invariant');
var _require2 = require('relay-runtime'),
  fetchQueryInternal = _require2.__internal.fetchQuery,
  RelayFeatureFlags = _require2.RelayFeatureFlags,
  createOperationDescriptor = _require2.createOperationDescriptor,
  getPendingOperationsForFragment = _require2.getPendingOperationsForFragment,
  getSelector = _require2.getSelector,
  getVariablesFromFragment = _require2.getVariablesFromFragment,
  handlePotentialSnapshotErrors = _require2.handlePotentialSnapshotErrors;
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
function handlePotentialSnapshotErrorsForState(environment, state) {
  if (state.kind === 'singular') {
    handlePotentialSnapshotErrors(environment, state.snapshot.missingRequiredFields, state.snapshot.relayResolverErrors);
  } else if (state.kind === 'plural') {
    var _iterator3 = (0, _createForOfIteratorHelper2["default"])(state.snapshots),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var snapshot = _step3.value;
        handlePotentialSnapshotErrors(environment, snapshot.missingRequiredFields, snapshot.relayResolverErrors);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
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
function getFragmentState(environment, fragmentSelector) {
  if (fragmentSelector == null) {
    return {
      kind: 'bailout'
    };
  } else if (fragmentSelector.kind === 'PluralReaderSelector') {
    if (fragmentSelector.selectors.length === 0) {
      return {
        kind: 'bailout'
      };
    } else {
      return {
        kind: 'plural',
        snapshots: fragmentSelector.selectors.map(function (s) {
          return environment.lookup(s);
        }),
        epoch: environment.getStore().getEpoch()
      };
    }
  } else {
    return {
      kind: 'singular',
      snapshot: environment.lookup(fragmentSelector),
      epoch: environment.getStore().getEpoch()
    };
  }
}
function readFragmentInternal_EXPERIMENTAL(environment, fragmentNode, fragmentRef, hookDisplayName, queryOptions, fragmentKey) {
  var _fragmentNode$metadat, _fragmentNode$metadat2;
  var fragmentSelector = getSelector(fragmentNode, fragmentRef);
  var isPlural = (fragmentNode === null || fragmentNode === void 0 ? void 0 : (_fragmentNode$metadat = fragmentNode.metadata) === null || _fragmentNode$metadat === void 0 ? void 0 : _fragmentNode$metadat.plural) === true;
  if (isPlural) {
    !(fragmentRef == null || Array.isArray(fragmentRef)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected fragment pointer%s for fragment `%s` to be ' + 'an array, instead got `%s`. Remove `@relay(plural: true)` ' + 'from fragment `%s` to allow the prop to be an object.', fragmentKey != null ? " for key `".concat(fragmentKey, "`") : '', fragmentNode.name, typeof fragmentRef, fragmentNode.name) : invariant(false) : void 0;
  } else {
    !!Array.isArray(fragmentRef) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected fragment pointer%s for fragment `%s` not to be ' + 'an array, instead got `%s`. Add `@relay(plural: true)` ' + 'to fragment `%s` to allow the prop to be an array.', fragmentKey != null ? " for key `".concat(fragmentKey, "`") : '', fragmentNode.name, typeof fragmentRef, fragmentNode.name) : invariant(false) : void 0;
  }
  !(fragmentRef == null || isPlural && Array.isArray(fragmentRef) && fragmentRef.length === 0 || fragmentSelector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Relay: Expected to receive an object where `...%s` was spread, ' + 'but the fragment reference was not found`. This is most ' + 'likely the result of:\n' + "- Forgetting to spread `%s` in `%s`'s parent's fragment.\n" + '- Conditionally fetching `%s` but unconditionally passing %s prop ' + 'to `%s`. If the parent fragment only fetches the fragment conditionally ' + '- with e.g. `@include`, `@skip`, or inside a `... on SomeType { }` ' + 'spread  - then the fragment reference will not exist. ' + 'In this case, pass `null` if the conditions for evaluating the ' + 'fragment are not met (e.g. if the `@include(if)` value is false.)', fragmentNode.name, fragmentNode.name, hookDisplayName, fragmentNode.name, fragmentKey == null ? 'a fragment reference' : "the `".concat(fragmentKey, "`"), hookDisplayName) : invariant(false) : void 0;
  var state = getFragmentState(environment, fragmentSelector);
  var clientEdgeQueries = null;
  if (((_fragmentNode$metadat2 = fragmentNode.metadata) === null || _fragmentNode$metadat2 === void 0 ? void 0 : _fragmentNode$metadat2.hasClientEdges) === true) {
    var missingClientEdges = getMissingClientEdges(state);
    if (missingClientEdges !== null && missingClientEdges !== void 0 && missingClientEdges.length) {
      clientEdgeQueries = [];
      var _iterator4 = (0, _createForOfIteratorHelper2["default"])(missingClientEdges),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var edge = _step4.value;
          clientEdgeQueries.push(handleMissingClientEdge(environment, fragmentNode, fragmentRef, edge, queryOptions));
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }
  if (isMissingData(state)) {
    !(fragmentSelector != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'refinement, see invariants above') : invariant(false) : void 0;
    var fragmentOwner = fragmentSelector.kind === 'PluralReaderSelector' ? fragmentSelector.selectors[0].owner : fragmentSelector.owner;
    var pendingOperationsResult = getPendingOperationsForFragment(environment, fragmentNode, fragmentOwner);
    if (pendingOperationsResult) {
      throw pendingOperationsResult.promise;
    }
    handlePotentialSnapshotErrorsForState(environment, state);
  }
  var data;
  if (state.kind === 'bailout') {
    data = isPlural ? [] : null;
  } else if (state.kind === 'singular') {
    data = state.snapshot.data;
  } else {
    data = state.snapshots.map(function (s) {
      return s.data;
    });
  }
  if (RelayFeatureFlags.LOG_MISSING_RECORDS_IN_PROD || process.env.NODE_ENV !== "production") {
    if (fragmentRef != null && (data === undefined || Array.isArray(data) && data.length > 0 && data.every(function (d) {
      return d === undefined;
    }))) {
      process.env.NODE_ENV !== "production" ? warning(false, 'Relay: Expected to have been able to read non-null data for ' + 'fragment `%s` declared in ' + '`%s`, since fragment reference was non-null. ' + "Make sure that that `%s`'s parent isn't " + 'holding on to and/or passing a fragment reference for data that ' + 'has been deleted.', fragmentNode.name, hookDisplayName, hookDisplayName) : void 0;
    }
  }
  return {
    data: data,
    clientEdgeQueries: clientEdgeQueries
  };
}
module.exports = readFragmentInternal_EXPERIMENTAL;