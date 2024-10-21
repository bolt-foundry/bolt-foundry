# Installation
> `npm install --save @types/root__asn1`

# Summary
This package contains type definitions for @root/asn1 (https://git.coolaj86.com/coolaj86/asn1.js).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/root__asn1.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/root__asn1/index.d.ts)
````ts
export {};

interface Element<V extends string | Uint8Array> {
    type: number;
    lengthSize: number;
    length: number;
    value?: V | undefined;
    children?: Array<Element<V>> | undefined;
}

export type ElementHex = Element<string>;

export type ElementBuffer = Element<Uint8Array>;

export interface ElementInput {
    type: number;
    value?: string | Uint8Array | undefined;
    children?: ElementInput[] | undefined;
}

export type ArrJson = [string, string | ArrJson[]];

export type ArrBuffer = [number, Uint8Array | ArrBuffer[]];

export type ArrInput = [string | number, string | Uint8Array | ArrInput[]];

export function parseVerbose(buf: Uint8Array, opts?: { json?: false | undefined }): ElementBuffer;

export function parseVerbose(buf: Uint8Array, opts: { json: true }): ElementHex;

export function parse(opts: { der: Uint8Array; verbose?: false | undefined; json?: true | undefined }): ArrJson;

export function parse(opts: { der: Uint8Array; verbose?: false | undefined; json: false }): ArrBuffer;

export function parse(opts: { der: Uint8Array; verbose: true; json?: true | undefined }): ElementHex;

export function parse(opts: { der: Uint8Array; verbose: true; json: false }): ElementBuffer;

export function pack(asn1: ElementInput | ArrInput, opts?: { json?: false | undefined }): Uint8Array;

export function pack(asn1: ElementInput | ArrInput, opts: { json: true }): string;

export function Any(hexType: string | number, ...hexBytes: string[]): string;

export function UInt(hexBigInt: string): string;

export function BitStr(hexBitStream: string): string;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 15:11:36 GMT
 * Dependencies: none

# Credits
These definitions were written by [Junxiao Shi](https://github.com/yoursunny).
