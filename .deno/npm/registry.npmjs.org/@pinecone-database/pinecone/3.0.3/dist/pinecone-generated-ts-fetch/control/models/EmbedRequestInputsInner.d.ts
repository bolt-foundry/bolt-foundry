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
/**
 *
 * @export
 * @interface EmbedRequestInputsInner
 */
export interface EmbedRequestInputsInner {
    /**
     *
     * @type {string}
     * @memberof EmbedRequestInputsInner
     */
    text?: string;
}
/**
 * Check if a given object implements the EmbedRequestInputsInner interface.
 */
export declare function instanceOfEmbedRequestInputsInner(value: object): boolean;
export declare function EmbedRequestInputsInnerFromJSON(json: any): EmbedRequestInputsInner;
export declare function EmbedRequestInputsInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): EmbedRequestInputsInner;
export declare function EmbedRequestInputsInnerToJSON(value?: EmbedRequestInputsInner | null): any;
