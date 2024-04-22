/// <reference path="https://esm.sh/v135/node.ns.d.ts" />
/// <reference path="https://esm.sh/v135/@whatwg-node/fetch@0.9.13/dist/index.d.ts" />
import type { RequestListener } from 'https://esm.sh/v135/@types/node@18.16.19/http.d.ts';
import type { NodeRequest, NodeResponse } from './utils.d.ts';
import { UWSHandler, UWSRequest, UWSResponse } from './uwebsockets.d.ts';
export interface FetchEvent extends Event {
    waitUntil(f: Promise<void> | void): void;
    request: Request;
    respondWith(r: Response | PromiseLike<Response>): void;
}
export interface ServerAdapterBaseObject<TServerContext, THandleRequest extends ServerAdapterRequestHandler<TServerContext> = ServerAdapterRequestHandler<TServerContext>> {
    /**
     * An async function that takes `Request` and the server context and returns a `Response`.
     * If you use `requestListener`, the server context is `{ req: IncomingMessage, res: ServerResponse }`.
     */
    handle: THandleRequest;
}
export interface ServerAdapterObject<TServerContext> extends EventListenerObject {
    /**
     * A basic request listener that takes a `Request` with the server context and returns a `Response`.
     */
    handleRequest: (request: Request, ctx: TServerContext) => Promise<Response> | Response;
    /**
     * WHATWG Fetch spec compliant `fetch` function that can be used for testing purposes.
     */
    fetch(request: Request, ctx: TServerContext): Promise<Response> | Response;
    fetch(request: Request, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(urlStr: string, ctx: TServerContext): Promise<Response> | Response;
    fetch(urlStr: string, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(urlStr: string, init: RequestInit, ctx: TServerContext): Promise<Response> | Response;
    fetch(urlStr: string, init: RequestInit, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(url: URL, ctx: TServerContext): Promise<Response> | Response;
    fetch(url: URL, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(url: URL, init: RequestInit, ctx: TServerContext): Promise<Response> | Response;
    fetch(url: URL, init: RequestInit, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    /**
     * This function takes Node's request object and returns a WHATWG Fetch spec compliant `Response` object.
     **/
    handleNodeRequest(nodeRequest: NodeRequest, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    /**
     * A request listener function that can be used with any Node server variation.
     */
    requestListener: RequestListener;
    handleUWS: UWSHandler;
    handle(req: NodeRequest, res: NodeResponse, ...ctx: Partial<TServerContext>[]): Promise<void>;
    handle(request: Request, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    handle(fetchEvent: FetchEvent & Partial<TServerContext>, ...ctx: Partial<TServerContext>[]): void;
    handle(res: UWSResponse, req: UWSRequest, ...ctx: Partial<TServerContext>[]): Promise<void>;
    handle(container: {
        request: Request;
    } & Partial<TServerContext>, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
}
export type ServerAdapter<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext>> = TBaseObject & ServerAdapterObject<TServerContext>['handle'] & ServerAdapterObject<TServerContext>;
export type ServerAdapterRequestHandler<TServerContext> = (request: Request, ctx: TServerContext) => Promise<Response> | Response;
export type ServerAdapterNodeContext = {
    req: NodeRequest;
    res: NodeResponse;
};
export type WaitUntilFn = (promise: Promise<void> | void) => void;
export type FetchAPI = ReturnType<typeof import('https://esm.sh/v135/@whatwg-node/fetch@0.9.13/dist/index.d.ts').createFetch>;
