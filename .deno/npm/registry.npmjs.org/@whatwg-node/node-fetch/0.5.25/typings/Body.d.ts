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
    protected handleContentLengthHeader(this: PonyfillBody & {
        headers: Headers;
    }, forceSet?: boolean): void;
    get body(): PonyfillReadableStream<Uint8Array> | null;
    _chunks: Uint8Array[] | null;
    _collectChunksFromReadable(): Promise<Uint8Array[]>;
    _blob: PonyfillBlob | null;
    blob(): Promise<PonyfillBlob>;
    _formData: PonyfillFormData | null;
    formData(opts?: {
        formDataLimits: FormDataLimits;
    }): Promise<PonyfillFormData>;
    buffer(): Promise<Buffer>;
    bytes(): Promise<Uint8Array>;
    arrayBuffer(): Promise<ArrayBuffer>;
    _json: TJSON | null;
    json(): Promise<TJSON>;
    _text: string | null;
    text(): Promise<string>;
}