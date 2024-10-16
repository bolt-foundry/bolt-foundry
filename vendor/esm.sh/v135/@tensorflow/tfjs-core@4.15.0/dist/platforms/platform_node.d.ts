/// <amd-module name="@tensorflow/tfjs-core/dist/platforms/platform_node" />
import { Platform } from './platform.d.ts';
export declare const getNodeFetch: {
    importFetch: () => any;
};
type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;
export declare function resetSystemFetch(): void;
export declare function setSystemFetch(fetchFn: FetchFn): void;
export declare function getSystemFetch(): FetchFn;
export declare class PlatformNode implements Platform {
    private textEncoder;
    util: any;
    constructor();
    fetch(path: string, requestInits?: RequestInit): Promise<Response>;
    now(): number;
    encode(text: string, encoding: string): Uint8Array;
    decode(bytes: Uint8Array, encoding: string): string;
    isTypedArray(a: unknown): a is Float32Array | Int32Array | Uint8Array | Uint8ClampedArray;
}
export {};
