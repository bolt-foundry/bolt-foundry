import { DataID, Disposable } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

/**
 * This hook subscribes a callback to the invalidation state of the given data
 * ids.
 * Any time the invalidation state of the given data ids changes, the provided
 * callback will be called.
 * If new ids or a new callback are provided, the subscription will be
 * re-established and the previous one will be disposed.
 * The subscription will automatically be disposed on unmount
 */
export function useSubscribeToInvalidationState(dataIDs: readonly DataID[], callback: () => void): Disposable;
