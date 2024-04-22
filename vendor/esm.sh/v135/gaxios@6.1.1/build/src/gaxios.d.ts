/// <reference path="https://esm.sh/v135/node.ns.d.ts" />
import { Agent } from 'https://esm.sh/v135/@types/node@18.16.19/http.d.ts';
import { URL } from 'https://esm.sh/v135/@types/node@18.16.19/url.d.ts';
import { GaxiosOptions, GaxiosPromise } from './common.d.ts';
export declare class Gaxios {
    protected agentCache: Map<string, Agent | ((parsedUrl: URL) => Agent)>;
    /**
     * Default HTTP options that will be used for every HTTP request.
     */
    defaults: GaxiosOptions;
    /**
     * The Gaxios class is responsible for making HTTP requests.
     * @param defaults The default set of options to be used for this instance.
     */
    constructor(defaults?: GaxiosOptions);
    /**
     * Perform an HTTP request with the given options.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */
    request<T = any>(opts?: GaxiosOptions): GaxiosPromise<T>;
    private _defaultAdapter;
    /**
     * Internal, retryable version of the `request` method.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */
    protected _request<T = any>(opts?: GaxiosOptions): GaxiosPromise<T>;
    private getResponseData;
    /**
     * Validates the options, and merges them with defaults.
     * @param opts The original options passed from the client.
     */
    private validateOpts;
    /**
     * By default, throw for any non-2xx status code
     * @param status status code from the HTTP response
     */
    private validateStatus;
    /**
     * Encode a set of key/value pars into a querystring format (?foo=bar&baz=boo)
     * @param params key value pars to encode
     */
    private paramsSerializer;
    private translateResponse;
    /**
     * Attempts to parse a response by looking at the Content-Type header.
     * @param {FetchResponse} response the HTTP response.
     * @returns {Promise<any>} a promise that resolves to the response data.
     */
    private getResponseDataFromContentType;
}
