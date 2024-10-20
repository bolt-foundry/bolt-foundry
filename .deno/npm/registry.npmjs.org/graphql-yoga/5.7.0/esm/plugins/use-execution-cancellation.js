/**
 * Enables experimental support for request cancelation.
 */
export function useExecutionCancellation() {
    return {
        onExecute({ args }) {
            // @ts-expect-error we don't have this typing in envelop
            args.signal = args.contextValue?.request?.signal ?? undefined;
        },
        onSubscribe({ args }) {
            // @ts-expect-error we don't have this typing in envelop
            args.signal = args.contextValue?.request?.signal ?? undefined;
        },
    };
}
