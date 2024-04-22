import { GraphQLSubscriptionConfig, OperationType, requestSubscription } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function useSubscription<TSubscriptionPayload extends OperationType>(
    // The actual subtype of OperationType is required to allow for type inference inside GraphQLSubscriptionConfig.s
    config: GraphQLSubscriptionConfig<TSubscriptionPayload>,
    requestSubscriptionFn?: typeof requestSubscription,
): void;
