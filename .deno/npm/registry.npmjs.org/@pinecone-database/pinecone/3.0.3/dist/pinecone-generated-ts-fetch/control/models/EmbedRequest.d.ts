/**
 * Pinecone Control Plane API
 * Pinecone is a vector database that makes it easy to search and retrieve billions of high-dimensional vectors.
 *
 * The version of the OpenAPI document: 2024-07
 * Contact: support@pinecone.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import type { EmbedRequestInputsInner } from './EmbedRequestInputsInner';
import type { EmbedRequestParameters } from './EmbedRequestParameters';
/**
 * Generate embeddings for inputs
 * @export
 * @interface EmbedRequest
 */
export interface EmbedRequest {
    /**
     *
     * @type {string}
     * @memberof EmbedRequest
     */
    model: string;
    /**
     *
     * @type {EmbedRequestParameters}
     * @memberof EmbedRequest
     */
    parameters?: EmbedRequestParameters;
    /**
     *
     * @type {Array<EmbedRequestInputsInner>}
     * @memberof EmbedRequest
     */
    inputs: Array<EmbedRequestInputsInner>;
}
/**
 * Check if a given object implements the EmbedRequest interface.
 */
export declare function instanceOfEmbedRequest(value: object): boolean;
export declare function EmbedRequestFromJSON(json: any): EmbedRequest;
export declare function EmbedRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmbedRequest;
export declare function EmbedRequestToJSON(value?: EmbedRequest | null): any;