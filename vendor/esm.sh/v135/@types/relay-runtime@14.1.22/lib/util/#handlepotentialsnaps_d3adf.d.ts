import { Environment, MissingRequiredFields, RelayResolverErrors } from "../store/RelayStoreTypes.d.ts";

export default function handlePotentialSnapshotErrors(
    environment: Environment,
    missingRequiredFields: MissingRequiredFields | null | undefined,
    relayResolverErrors: RelayResolverErrors,
): void;
