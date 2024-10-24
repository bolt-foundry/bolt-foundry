/// <reference types="node" />
import { Agent } from 'http';
import { BodyPonyfillInit, PonyfillBody, PonyfillBodyOptions } from './Body.cjs';
import { PonyfillHeadersInit } from './Headers.cjs';
export type RequestPonyfillInit = PonyfillBodyOptions & Omit<RequestInit, 'body' | 'headers'> & {
    body?: BodyPonyfillInit | null;
    duplex?: 'half' | 'full';
    headers?: PonyfillHeadersInit;
    headersSerializer?: HeadersSerializer;
    agent?: Agent;
};
type HeadersSerializer = (headers: Headers, onContentLength?: (contentLength: string) => void) => string[];
export declare class PonyfillRequest<TJSON = any> extends PonyfillBody<TJSON> implements Request {
    constructor(input: RequestInfo | URL, options?: RequestPonyfillInit);
    headersSerializer?: HeadersSerializer;
    cache: RequestCache;
    credentials: RequestCredentials;
    destination: RequestDestination;
    headers: Headers;
    integrity: string;
    keepalive: boolean;
    method: string;
    mode: RequestMode;
    priority: 'auto' | 'high' | 'low';
    redirect: RequestRedirect;
    referrer: string;
    referrerPolicy: ReferrerPolicy;
    url: string;
    agent?: Agent;
    duplex: 'half' | 'full';
    private _signal;
    get signal(): AbortSignal;
    clone(): PonyfillRequest<TJSON>;
    [Symbol.toStringTag]: string;
}
export {};
