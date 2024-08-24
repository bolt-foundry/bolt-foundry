import * as api from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
/**
 * method "open" from XMLHttpRequest
 */
export declare type OpenFunction = (method: string, url: string, async?: boolean, user?: string | null, pass?: string | null) => void;
/**
 * method "send" from XMLHttpRequest
 */
export declare type SendFunction = typeof XMLHttpRequest.prototype.send;
export declare type SendBody = string | Document | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null;
/**
 * interface to store information in weak map about spans, resources and
 * callbacks
 */
export interface XhrMem {
    status?: number;
    statusText?: string;
    span: api.Span;
    spanUrl?: string;
    sendStartTime?: api.HrTime;
    createdResources?: {
        observer: PerformanceObserver;
        entries: PerformanceResourceTiming[];
    };
    callbackToRemoveEvents?: Function;
}
export declare type PropagateTraceHeaderCorsUrl = string | RegExp;
export declare type PropagateTraceHeaderCorsUrls = PropagateTraceHeaderCorsUrl | PropagateTraceHeaderCorsUrl[];
//# sourceMappingURL=types.d.ts.map
