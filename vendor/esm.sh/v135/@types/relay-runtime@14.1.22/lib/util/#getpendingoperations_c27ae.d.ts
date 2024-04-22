import type { Environment, RequestDescriptor } from "../store/RelayStoreTypes.d.ts";
import type { ReaderFragment } from "./ReaderNode.d.ts";

export default function getPendingOperationsForFragment(
    environment: Environment,
    fragmentNode: ReaderFragment,
    fragmentOwner: RequestDescriptor,
): {
    promise: Promise<void>;
    pendingOperations: readonly RequestDescriptor[];
} | null;
