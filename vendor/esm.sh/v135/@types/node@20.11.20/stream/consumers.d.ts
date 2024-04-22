/// <reference path="https://esm.sh/v135/node.ns.d.ts" />
declare module "stream/consumers" {
    import { Blob as NodeBlob } from "https://esm.sh/v135/@types/node@20.11.20/buffer.d.ts";
    import { Readable } from "https://esm.sh/v135/@types/node@20.11.20/stream.d.ts";
    function buffer(stream: NodeJS.ReadableStream | Readable | AsyncIterable<any>): Promise<Buffer>;
    function text(stream: NodeJS.ReadableStream | Readable | AsyncIterable<any>): Promise<string>;
    function arrayBuffer(stream: NodeJS.ReadableStream | Readable | AsyncIterable<any>): Promise<ArrayBuffer>;
    function blob(stream: NodeJS.ReadableStream | Readable | AsyncIterable<any>): Promise<NodeBlob>;
    function json(stream: NodeJS.ReadableStream | Readable | AsyncIterable<any>): Promise<unknown>;
}
declare module "https://esm.sh/v135/@types/node@20.11.20/stream/consumers.d.ts" {
    export * from "stream/consumers";
}
