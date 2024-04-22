import ConnectionInterface from "./lib/handlers/connection/ConnectionInterface.d.ts";
export { ConnectionInterface };
export { ConnectionMetadata } from "./lib/handlers/connection/ConnectionHandler.d.ts";
export { EdgeRecord, PageInfo } from "./lib/handlers/connection/ConnectionInterface.d.ts";
export { OptimisticMutationConfig } from "./lib/mutations/applyOptimisticMutation.d.ts";
export { MutationConfig, MutationParameters } from "./lib/mutations/commitMutation.d.ts";
export {
    DeclarativeMutationConfig,
    MutationTypes,
    RangeBehaviors,
    RangeOperations,
} from "./lib/mutations/RelayDeclarativeMutationConfig.d.ts";
export {
    MutationTypes as MutationType,
    RangeOperations as RangeOperation,
} from "./lib/mutations/RelayDeclarativeMutationConfig.d.ts";
export {
    ExecuteFunction,
    FetchFunction,
    GraphQLResponse,
    GraphQLResponseWithData,
    GraphQLResponseWithoutData,
    GraphQLSingularResponse,
    LogRequestInfoFunction,
    Network as INetwork,
    PayloadData,
    PayloadError,
    ReactFlightPayloadData,
    ReactFlightPayloadQuery,
    ReactFlightServerTree,
    SubscribeFunction,
    Uploadable,
    UploadableMap,
} from "./lib/network/RelayNetworkTypes.d.ts";
export { ObservableFromValue, Observer, Subscribable, Subscription } from "./lib/network/RelayObservable.d.ts";
export {
    getFragment,
    getInlineDataFragment,
    getNode,
    getPaginationFragment,
    getRefetchableFragment,
    getRequest,
    graphql,
    GraphQLTaggedNode,
    isFragment,
    isInlineDataFragment,
    isRequest,
} from "./lib/query/RelayModernGraphQLTag.d.ts";
export { generateClientID, generateUniqueClientID, isClientID } from "./lib/store/ClientID.d.ts";
export { TaskScheduler } from "./lib/store/RelayModernQueryExecutor.d.ts";
export { RecordState } from "./lib/store/RelayRecordState.d.ts";
export {
    Environment as IEnvironment,
    FragmentMap,
    FragmentPointer,
    FragmentSpecResolver,
    FragmentType,
    /** @deprecated use FragmentType instead of FragmentReference */
    FragmentType as FragmentReference,
    HandleFieldPayload,
    HasUpdatableSpread,
    InvalidationState,
    LogEvent,
    LogFunction,
    MissingFieldHandler,
    ModuleImportPointer,
    MutableRecordSource,
    NormalizationSelector,
    OperationAvailability,
    OperationDescriptor,
    OperationLoader,
    OperationTracker,
    OptimisticResponseConfig,
    OptimisticUpdate,
    OptimisticUpdateFunction,
    PluralReaderSelector,
    Props,
    PublishQueue,
    ReactFlightClientResponse,
    ReactFlightPayloadDeserializer,
    ReaderSelector,
    ReadOnlyRecordProxy,
    RecordProxy,
    RecordSourceProxy,
    RecordSourceSelectorProxy,
    RelayContext,
    RequestDescriptor,
    RequiredFieldLogger,
    SelectorData,
    SelectorStoreUpdater,
    SingularReaderSelector,
    Snapshot,
    StoreUpdater,
    UpdatableFragmentData,
    UpdatableQueryData,
} from "./lib/store/RelayStoreTypes.d.ts";
export { GraphQLSubscriptionConfig } from "./lib/subscription/requestSubscription.d.ts";
export {
    NormalizationArgument,
    NormalizationDefer,
    NormalizationField,
    NormalizationFlightField,
    NormalizationLinkedField,
    NormalizationLinkedHandle,
    NormalizationLocalArgumentDefinition,
    NormalizationModuleImport,
    NormalizationOperation,
    NormalizationRootNode,
    NormalizationScalarField,
    NormalizationSelection,
    NormalizationSplitOperation,
    NormalizationStream,
    NormalizationTypeDiscriminator,
} from "./lib/util/NormalizationNode.d.ts";
export {
    ReaderArgument,
    ReaderArgumentDefinition,
    ReaderField,
    ReaderFlightField,
    ReaderFragment,
    ReaderInlineDataFragment,
    ReaderInlineDataFragmentSpread,
    ReaderLinkedField,
    ReaderModuleImport,
    ReaderPaginationMetadata,
    ReaderRefetchableFragment,
    ReaderRefetchMetadata,
    ReaderRequiredField,
    ReaderScalarField,
    ReaderSelection,
    RequiredFieldAction,
} from "./lib/util/ReaderNode.d.ts";
export {
    ConcreteRequest,
    ConcreteUpdatableQuery,
    GeneratedNode,
    PreloadableConcreteRequest,
    RequestParameters,
} from "./lib/util/RelayConcreteNode.d.ts";
export { RelayReplaySubject as ReplaySubject } from "./lib/util/RelayReplaySubject.d.ts";
export * from "./lib/util/RelayRuntimeTypes.d.ts";

// Core API
export { RelayNetwork as Network } from "./lib/network/RelayNetwork.d.ts";
export { RelayObservable as Observable } from "./lib/network/RelayObservable.d.ts";
export { default as Environment, EnvironmentConfig } from "./lib/store/RelayModernEnvironment.d.ts";
import QueryResponseCache from "./lib/network/RelayQueryResponseCache.d.ts";
export { QueryResponseCache };
export { RelayModernRecord as Record } from "./lib/store/RelayModernRecord.d.ts";
export { default as Store } from "./lib/store/RelayModernStore.d.ts";
export { RelayRecordSource as RecordSource } from "./lib/store/RelayRecordSource.d.ts";

export { createFragmentSpecResolver } from "./lib/store/createFragmentSpecResolver.d.ts";
export { readInlineData } from "./lib/store/readInlineData.d.ts";
export { createOperationDescriptor, createRequestDescriptor } from "./lib/store/RelayModernOperationDescriptor.d.ts";
export {
    areEqualSelectors,
    createNormalizationSelector,
    createReaderSelector,
    getDataIDsFromFragment,
    getDataIDsFromObject,
    getPluralSelector,
    getSelector,
    getSelectorsFromObject,
    getSingularSelector,
    getVariablesFromFragment,
    getVariablesFromObject,
    getVariablesFromPluralFragment,
    getVariablesFromSingularFragment,
} from "./lib/store/RelayModernSelector.d.ts";
export {
    FRAGMENT_OWNER_KEY,
    FRAGMENTS_KEY,
    getModuleComponentKey,
    getModuleOperationKey,
    getStorageKey,
    ID_KEY,
    REF_KEY,
    REFS_KEY,
    ROOT_ID,
    ROOT_TYPE,
    TYPENAME_KEY,
} from "./lib/store/RelayStoreUtils.d.ts";

// Extensions
export { RelayDefaultHandlerProvider as DefaultHandlerProvider } from "./lib/handlers/RelayDefaultHandlerProvider.d.ts";

import getDefaultMissingFieldHandlers from "./lib/handlers/getRelayDefaultMissingFieldHandlers.d.ts";
export { getDefaultMissingFieldHandlers };
import * as ConnectionHandler from "./lib/handlers/connection/ConnectionHandler.d.ts";
export { ConnectionHandler };
export { MutationHandlers } from "./lib/handlers/connection/MutationHandlers.d.ts";
export { VIEWER_ID, VIEWER_TYPE } from "./lib/store/ViewerPattern.d.ts";

// Helpers (can be implemented via the above API)
export { applyOptimisticMutation } from "./lib/mutations/applyOptimisticMutation.d.ts";
export { commitLocalUpdate } from "./lib/mutations/commitLocalUpdate.d.ts";
export { commitMutation } from "./lib/mutations/commitMutation.d.ts";
export { fetchQuery } from "./lib/query/fetchQuery.d.ts";
export { fetchQuery_DEPRECATED } from "./lib/query/fetchQuery_DEPRECATED.d.ts";
export { isRelayModernEnvironment } from "./lib/store/isRelayModernEnvironment.d.ts";
export { requestSubscription } from "./lib/subscription/requestSubscription.d.ts";

// Utilities
export { default as createPayloadFor3DField } from "./lib/util/createPayloadFor3DField.d.ts";
export { default as getFragmentIdentifier } from "./lib/util/getFragmentIdentifier.d.ts";
export { default as getPaginationMetadata } from "./lib/util/getPaginationMetadata.d.ts";
export { default as getPaginationVariables } from "./lib/util/getPaginationVariables.d.ts";
export { Direction } from "./lib/util/getPaginationVariables.d.ts";
export { default as getRefetchMetadata } from "./lib/util/getRefetchMetadata.d.ts";
export { default as getRelayHandleKey } from "./lib/util/getRelayHandleKey.d.ts";
export { default as getRequestIdentifier } from "./lib/util/getRequestIdentifier.d.ts";
export { default as getValueAtPath } from "./lib/util/getValueAtPath.d.ts";
export { default as handlePotentialSnapshotErrors } from "./lib/util/handlePotentialSnapshotErrors.d.ts";
export { default as PreloadableQueryRegistry } from "./lib/util/PreloadableQueryRegistry.d.ts";
export { RelayProfiler } from "./lib/util/RelayProfiler.d.ts";

// INTERNAL-ONLY
export { RelayConcreteNode } from "./lib/util/RelayConcreteNode.d.ts";
export { default as RelayError } from "./lib/util/RelayError.d.ts";
export { RelayFeatureFlags } from "./lib/util/RelayFeatureFlags.d.ts";
export const DEFAULT_HANDLE_KEY = "";
export { default as deepFreeze } from "./lib/util/deepFreeze.d.ts";
export { default as getPendingOperationsForFragment } from "./lib/util/getPendingOperationsForFragment.d.ts";
export { default as isPromise } from "./lib/util/isPromise.d.ts";
export { default as isScalarAndEqual } from "./lib/util/isScalarAndEqual.d.ts";
export { default as recycleNodesInto } from "./lib/util/recycleNodesInto.d.ts";
export { default as stableCopy } from "./lib/util/stableCopy.d.ts";

import * as fetchQueryInternal from "./lib/query/fetchQueryInternal.d.ts";
import withProvidedVariables from "./lib/util/withProvidedVariables.d.ts";

import * as RelayResolverFragments from "./lib/store/ResolverFragments.d.ts";

interface Internal {
    fetchQuery: typeof fetchQueryInternal.fetchQuery;
    fetchQueryDeduped: typeof fetchQueryInternal.fetchQueryDeduped;
    getPromiseForActiveRequest: typeof fetchQueryInternal.getPromiseForActiveRequest;
    getObservableForActiveRequest: typeof fetchQueryInternal.getObservableForActiveRequest;
    ResolverFragments: typeof RelayResolverFragments;
    withProvidedVariables: typeof withProvidedVariables;
}

export const __internal: Internal;

/**
 * relay-compiler-language-typescript support for fragment references
 */

export interface _RefType<Ref extends string> {
    " $fragmentType": Ref;
}

export interface _FragmentRefs<Refs extends string> {
    " $fragmentSpreads": FragmentRefs<Refs>;
}

// This is used in the actual artifacts to define the various fragment references a container holds.
export type FragmentRefs<Refs extends string> = {
    [ref in Refs]: true;
};

// This is a utility type for converting from a data type to a fragment reference that will resolve to that data type.
export type FragmentRef<Fragment> = Fragment extends _RefType<infer U> ? _FragmentRefs<U> : never;
