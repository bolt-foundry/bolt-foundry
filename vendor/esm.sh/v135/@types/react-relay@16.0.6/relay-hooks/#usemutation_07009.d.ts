import {
    DeclarativeMutationConfig,
    Disposable,
    GraphQLTaggedNode,
    IEnvironment,
    MutationConfig,
    MutationParameters,
    PayloadError,
    SelectorStoreUpdater,
    UploadableMap,
    VariablesOf,
} from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export interface UseMutationConfig<TMutation extends MutationParameters> {
    variables: VariablesOf<TMutation>;
    updater?: SelectorStoreUpdater<TMutation["response"]> | null | undefined;
    uploadables?: UploadableMap | undefined;
    optimisticUpdater?: SelectorStoreUpdater<TMutation["response"]> | null | undefined;
    optimisticResponse?: TMutation["rawResponse"] | undefined;
    configs?: DeclarativeMutationConfig[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    onError?: ((error: Error) => void | null) | undefined;
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    onCompleted?: ((response: TMutation["response"], errors: PayloadError[] | null) => void | null) | undefined;
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    onUnsubscribe?: (() => void | null) | undefined;
}

export function useMutation<TMutation extends MutationParameters>(
    mutation: GraphQLTaggedNode,
    commitMutationFn?: (environment: IEnvironment, config: MutationConfig<TMutation>) => Disposable,
): [(config: UseMutationConfig<TMutation>) => Disposable, boolean];
