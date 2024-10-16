import { ConcreteRequest } from "../util/RelayConcreteNode.d.ts";
import { CacheConfig, DataID, Variables } from "../util/RelayRuntimeTypes.d.ts";
import { OperationDescriptor, RequestDescriptor } from "./RelayStoreTypes.d.ts";
/**
 * Creates an instance of the `OperationDescriptor` type defined in
 * `RelayStoreTypes` given an operation and some variables. The input variables
 * are filtered to exclude variables that do not match defined arguments on the
 * operation, and default values are populated for null values.
 */
export function createOperationDescriptor(
    request: ConcreteRequest,
    variables: Variables,
    cacheConfig?: CacheConfig | null,
    dataID?: DataID,
): OperationDescriptor;

export function createRequestDescriptor(
    request: ConcreteRequest,
    variables: Variables,
    cacheConfig?: CacheConfig | null,
): RequestDescriptor;
