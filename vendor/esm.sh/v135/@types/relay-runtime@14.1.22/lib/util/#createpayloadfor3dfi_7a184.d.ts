import type { JSResourceReference } from "./JSResourceReference.d.ts";
import type { NormalizationSplitOperation } from "./NormalizationNode.d.ts";

export type Local3DPayload<DocumentName extends string, Response extends {}> = Response;

export default function createPayloadFor3DField<DocumentName extends string, Response extends {}>(
    name: DocumentName,
    operation: JSResourceReference<NormalizationSplitOperation>,
    component: JSResourceReference<unknown>,
    response: Response,
): Local3DPayload<DocumentName, Response>;
