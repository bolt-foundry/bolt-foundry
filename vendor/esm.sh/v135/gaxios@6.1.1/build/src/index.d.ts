import { GaxiosOptions } from './common.d.ts';
import { Gaxios } from './gaxios.d.ts';
export { GaxiosError, GaxiosPromise, GaxiosResponse, Headers, RetryConfig, } from './common.d.ts';
export { Gaxios, GaxiosOptions };
/**
 * The default instance used when the `request` method is directly
 * invoked.
 */
export declare const instance: Gaxios;
/**
 * Make an HTTP request using the given options.
 * @param opts Options for the request
 */
export declare function request<T>(opts: GaxiosOptions): Promise<import("./common.d.ts").GaxiosResponse<T>>;
