import { ReaderFragment, ReaderRefetchMetadata } from "./ReaderNode.d.ts";
import { ConcreteRequest } from "./RelayConcreteNode.d.ts";

export default function getRefetchMetadata(
    fragmentNode: ReaderFragment,
    componentDisplayName: string,
): {
    fragmentRefPathInResponse: ReadonlyArray<string | number>;
    identifierField: string | null | undefined;
    refetchableRequest: ConcreteRequest;
    refetchMetadata: ReaderRefetchMetadata;
};
