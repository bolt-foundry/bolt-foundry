import { HandlerProvider } from "../handlers/RelayDefaultHandlerProvider.d.ts";
import { GraphQLResponse, Network, PayloadData, UploadableMap } from "../network/RelayNetworkTypes.d.ts";
import { RelayObservable } from "../network/RelayObservable.d.ts";
import { Disposable, RenderPolicy } from "../util/RelayRuntimeTypes.d.ts";
import { TaskScheduler } from "./RelayModernQueryExecutor.d.ts";
import { RelayOperationTracker } from "./RelayOperationTracker.d.ts";
import type { GetDataID } from "./RelayResponseNormalizer.d.ts";
import {
    Environment,
    LogFunction,
    MissingFieldHandler,
    OperationAvailability,
    OperationDescriptor,
    OperationLoader,
    OperationTracker,
    OptimisticResponseConfig,
    OptimisticUpdateFunction,
    RequiredFieldLogger,
    SelectorStoreUpdater,
    SingularReaderSelector,
    Snapshot,
    Store,
    StoreUpdater,
} from "./RelayStoreTypes.d.ts";

export interface EnvironmentConfig {
    readonly configName?: string | undefined;
    readonly handlerProvider?: HandlerProvider | null | undefined;
    readonly treatMissingFieldsAsNull?: boolean | undefined;
    readonly log?: LogFunction | null | undefined;
    readonly operationLoader?: OperationLoader | null | undefined;
    readonly network: Network;
    readonly scheduler?: TaskScheduler | null | undefined;
    readonly store: Store;
    readonly missingFieldHandlers?: readonly MissingFieldHandler[] | null | undefined;
    readonly operationTracker?: OperationTracker | null | undefined;
    readonly getDataID?: GetDataID | null | undefined;
    readonly UNSTABLE_defaultRenderPolicy?: RenderPolicy | null | undefined;
    readonly options?: unknown | undefined;
    readonly isServer?: boolean | undefined;
    readonly requiredFieldLogger?: RequiredFieldLogger | null | undefined;
    readonly shouldProcessClientComponents?: boolean | null | undefined;
}

export default class RelayModernEnvironment implements Environment {
    options: unknown;
    configName: string | null | undefined;
    requiredFieldLogger: RequiredFieldLogger;
    constructor(config: EnvironmentConfig);
    getStore(): Store;
    getNetwork(): Network;
    getOperationTracker(): RelayOperationTracker;
    isRequestActive(requestIdentifier: string): boolean;
    applyUpdate(optimisticUpdate: OptimisticUpdateFunction): Disposable;
    revertUpdate(update: OptimisticUpdateFunction): void;
    replaceUpdate(update: OptimisticUpdateFunction, newUpdate: OptimisticUpdateFunction): void;
    applyMutation(optimisticConfig: OptimisticResponseConfig): Disposable;
    check(operation: OperationDescriptor): OperationAvailability;
    commitPayload(operationDescriptor: OperationDescriptor, payload: PayloadData): void;
    commitUpdate(updater: StoreUpdater): void;
    lookup(readSelector: SingularReaderSelector): Snapshot;
    subscribe(snapshot: Snapshot, callback: (snapshot: Snapshot) => void): Disposable;
    retain(operation: OperationDescriptor): Disposable;
    isServer(): boolean;
    execute(data: {
        operation: OperationDescriptor;
        updater?: SelectorStoreUpdater | null | undefined;
    }): RelayObservable<GraphQLResponse>;
    executeMutation({
        operation,
        optimisticResponse,
        optimisticUpdater,
        updater,
        uploadables,
    }: {
        operation: OperationDescriptor;
        optimisticUpdater?: SelectorStoreUpdater | null | undefined;
        optimisticResponse?: { [key: string]: any } | null | undefined;
        updater?: SelectorStoreUpdater | null | undefined;
        uploadables?: UploadableMap | null | undefined;
    }): RelayObservable<GraphQLResponse>;
    executeWithSource({
        operation,
        source,
    }: {
        operation: OperationDescriptor;
        source: RelayObservable<GraphQLResponse>;
    }): RelayObservable<GraphQLResponse>;
}
