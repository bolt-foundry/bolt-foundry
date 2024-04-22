import { ReaderFragment, ReaderPaginationMetadata } from "./ReaderNode.d.ts";
import { ConcreteRequest } from "./RelayConcreteNode.d.ts";

export default function getPaginationMetadata(
    fragmentNode: ReaderFragment,
    componentDisplayName: string,
): {
    connectionPathInFragmentData: ReadonlyArray<string | number>;
    identifierField: string | null | undefined;
    paginationRequest: ConcreteRequest;
    paginationMetadata: ReaderPaginationMetadata;
    stream: boolean;
};
