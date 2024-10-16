import { RequestDescriptor } from "./RelayStoreTypes.d.ts";

export class RelayOperationTracker {
    /**
     * Update the map of current processing operations with the set of
     * affected owners and notify subscribers
     */
    update(pendingOperation: RequestDescriptor, affectedOwners: Set<RequestDescriptor>): void;

    /**
     * Once pending operation is completed we need to remove it
     * from all tracking maps
     */
    complete(pendingOperation: RequestDescriptor): void;

    _resolveOwnerResolvers(owner: RequestDescriptor): void;

    getPendingOperationsAffectingOwner(owner: RequestDescriptor): {
        promise: Promise<void>;
        pendingOperations: readonly RequestDescriptor[];
    } | null;
}
