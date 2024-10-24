/// <reference types="node" />
/// <reference types="node" />
import { Readable } from 'stream';
import { PonyfillBlob } from './Blob.js';
import { PonyfillFormData } from './FormData.js';
import { PonyfillReadableStream } from './ReadableStream.js';
export type BodyPonyfillInit = XMLHttpRequestBodyInit | Readable | PonyfillReadableStream<Uint8Array> | AsyncIterable<Uint8Array>;
export interface FormDataLimits {
    fieldNameSize?: number;
    fieldSize?: number;
    fields?: number;
    fileSize?: number;
    files?: number;
    parts?: number;
    headerSize?: number;
}
export interface PonyfillBodyOptions {
    formDataLimits?: FormDataLimits;
}
export declare class PonyfillBody<TJSON = any> implements Body {
    private bodyInit;
    private options;
    bodyUsed: boolean;
    contentType: string | null;
    contentLength: number | null;
    constructor(bodyInit: BodyPonyfillInit | null, options?: PonyfillBodyOptions);
    private bodyType?;
    private _bodyFactory;
    private _generatedBody;
    private _buffer?;
    private generateBody;
    get body(): PonyfillReadableStream<Uint8Array> | null;
    _collectChunksFromReadable(): Promise<Uint8Array[]>;
    blob(): Promise<PonyfillBlob>;
    formData(opts?: {
        formDataLimits: FormDataLimits;
    }): Promise<PonyfillFormData>;
    arrayBuffer(): Promise<Buffer>;
    json(): Promise<TJSON>;
    text(): Promise<string>;
}
