import { PayloadData } from "../network/RelayNetworkTypes.d.ts";
import { MutableRecordSource, NormalizationSelector, RelayResponsePayload, RequestDescriptor } from "./RelayStoreTypes.d.ts";

export type GetDataID = (fieldValue: { [key: string]: any }, typeName: string) => any;

export interface NormalizationOptions {
    getDataID: GetDataID;
    path?: readonly string[] | undefined;
    request: RequestDescriptor;
}

/**
 * Normalizes the results of a query and standard GraphQL response, writing the
 * normalized records/fields into the given MutableRecordSource.
 */
export function normalize(
    recordSource: MutableRecordSource,
    selector: NormalizationSelector,
    response: PayloadData,
    options: NormalizationOptions,
): RelayResponsePayload;
