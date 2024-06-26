import { Baggage, BaggageEntryMetadata } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
declare type ParsedBaggageKeyValue = {
    key: string;
    value: string;
    metadata: BaggageEntryMetadata | undefined;
};
export declare function serializeKeyPairs(keyPairs: string[]): string;
export declare function getKeyPairs(baggage: Baggage): string[];
export declare function parsePairKeyValue(entry: string): ParsedBaggageKeyValue | undefined;
/**
 * Parse a string serialized in the baggage HTTP Format (without metadata):
 * https://github.com/w3c/baggage/blob/master/baggage/HTTP_HEADER_FORMAT.md
 */
export declare function parseKeyPairsIntoRecord(value?: string): Record<string, string>;
export {};
//# sourceMappingURL=utils.d.ts.map
