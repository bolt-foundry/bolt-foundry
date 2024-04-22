import { RequestParameters } from "./RelayConcreteNode.d.ts";
import { Variables } from "./RelayRuntimeTypes.d.ts";

export type RequestIdentifier = string;

/**
 * Returns a stable identifier for the given pair of `RequestParameters` +
 * variables.
 */
export default function getRequestIdentifier(parameters: RequestParameters, variables: Variables): RequestIdentifier;
