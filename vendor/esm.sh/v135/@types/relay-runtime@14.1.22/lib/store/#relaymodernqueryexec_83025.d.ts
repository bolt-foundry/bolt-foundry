import { GraphQLResponse } from "../network/RelayNetworkTypes.d.ts";
import { RelayObservable, Sink } from "../network/RelayObservable.d.ts";
import { GetDataID } from "./RelayResponseNormalizer.d.ts";
import {
    OperationDescriptor,
    OperationLoader,
    OperationTracker,
    OptimisticResponseConfig,
    PublishQueue,
    ReactFlightPayloadDeserializer,
    SelectorStoreUpdater,
    Store,
} from "./RelayStoreTypes.d.ts";

export type ActiveState = "active" | "inactive";

export interface ExecuteConfig {
    readonly getDataID: GetDataID;
    readonly treatMissingFieldsAsNull: boolean;
    readonly operation: OperationDescriptor;
    readonly operationExecutions: Map<string, ActiveState>;
    readonly operationLoader: OperationLoader | null | undefined;
    readonly operationTracker?: OperationTracker | null | undefined;
    readonly optimisticConfig: OptimisticResponseConfig | null | undefined;
    readonly publishQueue: PublishQueue;
    readonly reactFlightPayloadDeserializer?: ReactFlightPayloadDeserializer | null | undefined;
    readonly scheduler?: TaskScheduler | null | undefined;
    readonly sink: Sink<GraphQLResponse>;
    readonly source: RelayObservable<GraphQLResponse>;
    readonly store: Store;
    readonly updater?: SelectorStoreUpdater | null | undefined;
    readonly isClientPayload?: boolean | undefined;
}

export interface TaskScheduler {
    cancel: (id: string) => void;
    schedule: (fn: () => void) => string;
}

export interface Executor {
    cancel: () => void;
}

export function execute(config: ExecuteConfig): Executor;
