import { SelectorStoreUpdater } from "../store/RelayStoreTypes.d.ts";
import { ConcreteRequest } from "../util/RelayConcreteNode.d.ts";
import { Variables } from "../util/RelayRuntimeTypes.d.ts";

export type MutationTypes = "RANGE_ADD" | "RANGE_DELETE" | "NODE_DELETE";

export type RangeOperations = "append" | "prepend";
export type RangeBehaviorsFunction = (connectionArgs: { [name: string]: unknown }) => RangeOperations;
export interface RangeBehaviorsObject {
    [key: string]: RangeOperations;
}
export type RangeBehaviors = RangeBehaviorsFunction | RangeBehaviorsObject;

export interface RangeAddConfig {
    type: "RANGE_ADD";
    parentName?: string | undefined;
    parentID?: string | undefined;
    connectionInfo?:
        | ReadonlyArray<{
            key: string;
            filters?: Variables | undefined;
            rangeBehavior: string;
        }>
        | undefined;
    connectionName?: string | undefined;
    edgeName: string;
    rangeBehaviors?: RangeBehaviors | undefined;
}

export interface RangeDeleteConfig {
    type: "RANGE_DELETE";
    parentName?: string | undefined;
    parentID?: string | undefined;
    connectionKeys?:
        | ReadonlyArray<{
            key: string;
            filters?: Variables | undefined;
        }>
        | undefined;
    connectionName?: string | undefined;
    deletedIDFieldName: string | readonly string[];
    pathToConnection: readonly string[];
}

export interface NodeDeleteConfig {
    type: "NODE_DELETE";
    parentName?: string | undefined;
    parentID?: string | undefined;
    connectionName?: string | undefined;
    deletedIDFieldName: string;
}

export type DeclarativeMutationConfig = RangeAddConfig | RangeDeleteConfig | NodeDeleteConfig;

export function convert(
    configs: DeclarativeMutationConfig[],
    request: ConcreteRequest,
    optimisticUpdater?: SelectorStoreUpdater,
    updater?: SelectorStoreUpdater,
): {
    optimisticUpdater: SelectorStoreUpdater;
    updater: SelectorStoreUpdater;
};
