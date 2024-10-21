'use strict';

var ConnectionHandler = require('./handlers/connection/ConnectionHandler');
var ConnectionInterface = require('./handlers/connection/ConnectionInterface');
var MutationHandlers = require('./handlers/connection/MutationHandlers');
var RelayDefaultHandlerProvider = require('./handlers/RelayDefaultHandlerProvider');
var applyOptimisticMutation = require('./mutations/applyOptimisticMutation');
var commitLocalUpdate = require('./mutations/commitLocalUpdate');
var commitMutation = require('./mutations/commitMutation');
var RelayDeclarativeMutationConfig = require('./mutations/RelayDeclarativeMutationConfig');
var RelayNetwork = require('./network/RelayNetwork');
var RelayObservable = require('./network/RelayObservable');
var RelayQueryResponseCache = require('./network/RelayQueryResponseCache');
var fetchQuery = require('./query/fetchQuery');
var fetchQuery_DEPRECATED = require('./query/fetchQuery_DEPRECATED');
var fetchQueryInternal = require('./query/fetchQueryInternal');
var GraphQLTag = require('./query/GraphQLTag');
var PreloadableQueryRegistry = require('./query/PreloadableQueryRegistry');
var _require = require('./store/ClientID'),
  generateClientID = _require.generateClientID,
  generateUniqueClientID = _require.generateUniqueClientID,
  isClientID = _require.isClientID;
var createFragmentSpecResolver = require('./store/createFragmentSpecResolver');
var createRelayContext = require('./store/createRelayContext');
var _require2 = require('./store/experimental-live-resolvers/LiveResolverSuspenseSentinel'),
  isSuspenseSentinel = _require2.isSuspenseSentinel,
  suspenseSentinel = _require2.suspenseSentinel;
var isRelayModernEnvironment = require('./store/isRelayModernEnvironment');
var normalizeResponse = require('./store/normalizeResponse');
var readInlineData = require('./store/readInlineData');
var RelayConcreteVariables = require('./store/RelayConcreteVariables');
var RelayModernEnvironment = require('./store/RelayModernEnvironment');
var RelayModernOperationDescriptor = require('./store/RelayModernOperationDescriptor');
var RelayModernRecord = require('./store/RelayModernRecord');
var RelayModernSelector = require('./store/RelayModernSelector');
var RelayModernStore = require('./store/RelayModernStore');
var RelayOperationTracker = require('./store/RelayOperationTracker');
var RelayRecordSource = require('./store/RelayRecordSource');
var RelayStoreUtils = require('./store/RelayStoreUtils');
var ResolverFragments = require('./store/ResolverFragments');
var ViewerPattern = require('./store/ViewerPattern');
var requestSubscription = require('./subscription/requestSubscription');
var createPayloadFor3DField = require('./util/createPayloadFor3DField');
var deepFreeze = require('./util/deepFreeze');
var getFragmentIdentifier = require('./util/getFragmentIdentifier');
var getPaginationMetadata = require('./util/getPaginationMetadata');
var getPaginationVariables = require('./util/getPaginationVariables');
var getPendingOperationsForFragment = require('./util/getPendingOperationsForFragment');
var getRefetchMetadata = require('./util/getRefetchMetadata');
var getRelayHandleKey = require('./util/getRelayHandleKey');
var getRequestIdentifier = require('./util/getRequestIdentifier');
var getValueAtPath = require('./util/getValueAtPath');
var handlePotentialSnapshotErrors = require('./util/handlePotentialSnapshotErrors');
var isPromise = require('./util/isPromise');
var isScalarAndEqual = require('./util/isScalarAndEqual');
var recycleNodesInto = require('./util/recycleNodesInto');
var RelayConcreteNode = require('./util/RelayConcreteNode');
var RelayDefaultHandleKey = require('./util/RelayDefaultHandleKey');
var RelayError = require('./util/RelayError');
var RelayFeatureFlags = require('./util/RelayFeatureFlags');
var RelayProfiler = require('./util/RelayProfiler');
var RelayReplaySubject = require('./util/RelayReplaySubject');
var stableCopy = require('./util/stableCopy');
var withProvidedVariables = require('./util/withProvidedVariables');
if (process.env.NODE_ENV !== "production") {
  var mapStr = typeof Map !== 'function' ? 'Map' : null;
  var setStr = typeof Set !== 'function' ? 'Set' : null;
  var promiseStr = typeof Promise !== 'function' ? 'Promise' : null;
  var objStr = typeof Object.assign !== 'function' ? 'Object.assign' : null;
  if (mapStr || setStr || promiseStr || objStr) {
    throw new Error("relay-runtime requires ".concat([mapStr, setStr, promiseStr, objStr].filter(Boolean).join(', and '), " to exist. ") + 'Use a polyfill to provide these for older browsers.');
  }
}
module.exports = {
  Environment: RelayModernEnvironment,
  Network: RelayNetwork,
  Observable: RelayObservable,
  QueryResponseCache: RelayQueryResponseCache,
  RecordSource: RelayRecordSource,
  Record: RelayModernRecord,
  ReplaySubject: RelayReplaySubject,
  Store: RelayModernStore,
  areEqualSelectors: RelayModernSelector.areEqualSelectors,
  createFragmentSpecResolver: createFragmentSpecResolver,
  createNormalizationSelector: RelayModernSelector.createNormalizationSelector,
  createOperationDescriptor: RelayModernOperationDescriptor.createOperationDescriptor,
  createReaderSelector: RelayModernSelector.createReaderSelector,
  createRequestDescriptor: RelayModernOperationDescriptor.createRequestDescriptor,
  getArgumentValues: RelayStoreUtils.getArgumentValues,
  getDataIDsFromFragment: RelayModernSelector.getDataIDsFromFragment,
  getDataIDsFromObject: RelayModernSelector.getDataIDsFromObject,
  getNode: GraphQLTag.getNode,
  getFragment: GraphQLTag.getFragment,
  getInlineDataFragment: GraphQLTag.getInlineDataFragment,
  getModuleComponentKey: RelayStoreUtils.getModuleComponentKey,
  getModuleOperationKey: RelayStoreUtils.getModuleOperationKey,
  getPaginationFragment: GraphQLTag.getPaginationFragment,
  getPluralSelector: RelayModernSelector.getPluralSelector,
  getRefetchableFragment: GraphQLTag.getRefetchableFragment,
  getRequest: GraphQLTag.getRequest,
  getRequestIdentifier: getRequestIdentifier,
  getSelector: RelayModernSelector.getSelector,
  getSelectorsFromObject: RelayModernSelector.getSelectorsFromObject,
  getSingularSelector: RelayModernSelector.getSingularSelector,
  getStorageKey: RelayStoreUtils.getStorageKey,
  getVariablesFromFragment: RelayModernSelector.getVariablesFromFragment,
  getVariablesFromObject: RelayModernSelector.getVariablesFromObject,
  getVariablesFromPluralFragment: RelayModernSelector.getVariablesFromPluralFragment,
  getVariablesFromSingularFragment: RelayModernSelector.getVariablesFromSingularFragment,
  handlePotentialSnapshotErrors: handlePotentialSnapshotErrors,
  graphql: GraphQLTag.graphql,
  isFragment: GraphQLTag.isFragment,
  isInlineDataFragment: GraphQLTag.isInlineDataFragment,
  isSuspenseSentinel: isSuspenseSentinel,
  suspenseSentinel: suspenseSentinel,
  isRequest: GraphQLTag.isRequest,
  readInlineData: readInlineData,
  MutationTypes: RelayDeclarativeMutationConfig.MutationTypes,
  RangeOperations: RelayDeclarativeMutationConfig.RangeOperations,
  DefaultHandlerProvider: RelayDefaultHandlerProvider,
  ConnectionHandler: ConnectionHandler,
  MutationHandlers: MutationHandlers,
  VIEWER_ID: ViewerPattern.VIEWER_ID,
  VIEWER_TYPE: ViewerPattern.VIEWER_TYPE,
  applyOptimisticMutation: applyOptimisticMutation,
  commitLocalUpdate: commitLocalUpdate,
  commitMutation: commitMutation,
  fetchQuery: fetchQuery,
  fetchQuery_DEPRECATED: fetchQuery_DEPRECATED,
  isRelayModernEnvironment: isRelayModernEnvironment,
  requestSubscription: requestSubscription,
  ConnectionInterface: ConnectionInterface,
  PreloadableQueryRegistry: PreloadableQueryRegistry,
  RelayProfiler: RelayProfiler,
  createPayloadFor3DField: createPayloadFor3DField,
  RelayConcreteNode: RelayConcreteNode,
  RelayError: RelayError,
  RelayFeatureFlags: RelayFeatureFlags,
  DEFAULT_HANDLE_KEY: RelayDefaultHandleKey.DEFAULT_HANDLE_KEY,
  FRAGMENTS_KEY: RelayStoreUtils.FRAGMENTS_KEY,
  FRAGMENT_OWNER_KEY: RelayStoreUtils.FRAGMENT_OWNER_KEY,
  ID_KEY: RelayStoreUtils.ID_KEY,
  REF_KEY: RelayStoreUtils.REF_KEY,
  REFS_KEY: RelayStoreUtils.REFS_KEY,
  ROOT_ID: RelayStoreUtils.ROOT_ID,
  ROOT_TYPE: RelayStoreUtils.ROOT_TYPE,
  TYPENAME_KEY: RelayStoreUtils.TYPENAME_KEY,
  deepFreeze: deepFreeze,
  generateClientID: generateClientID,
  generateUniqueClientID: generateUniqueClientID,
  getRelayHandleKey: getRelayHandleKey,
  isClientID: isClientID,
  isPromise: isPromise,
  isScalarAndEqual: isScalarAndEqual,
  recycleNodesInto: recycleNodesInto,
  stableCopy: stableCopy,
  getFragmentIdentifier: getFragmentIdentifier,
  getRefetchMetadata: getRefetchMetadata,
  getPaginationMetadata: getPaginationMetadata,
  getPaginationVariables: getPaginationVariables,
  getPendingOperationsForFragment: getPendingOperationsForFragment,
  getValueAtPath: getValueAtPath,
  __internal: {
    ResolverFragments: ResolverFragments,
    OperationTracker: RelayOperationTracker,
    createRelayContext: createRelayContext,
    getOperationVariables: RelayConcreteVariables.getOperationVariables,
    getLocalVariables: RelayConcreteVariables.getLocalVariables,
    fetchQuery: fetchQueryInternal.fetchQuery,
    fetchQueryDeduped: fetchQueryInternal.fetchQueryDeduped,
    getPromiseForActiveRequest: fetchQueryInternal.getPromiseForActiveRequest,
    getObservableForActiveRequest: fetchQueryInternal.getObservableForActiveRequest,
    normalizeResponse: normalizeResponse,
    withProvidedVariables: withProvidedVariables
  }
};