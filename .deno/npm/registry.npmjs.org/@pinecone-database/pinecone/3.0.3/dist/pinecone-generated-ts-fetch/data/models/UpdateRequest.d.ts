/**
 * Pinecone Data Plane API
 * Pinecone is a vector database that makes it easy to search and retrieve billions of high-dimensional vectors.
 *
 * The version of the OpenAPI document: 2024-07
 * Contact: support@pinecone.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import type { SparseValues } from './SparseValues';
/**
 * The request for the `update` operation.
 * @export
 * @interface UpdateRequest
 */
export interface UpdateRequest {
    /**
     * Vector's unique id.
     * @type {string}
     * @memberof UpdateRequest
     */
    id: string;
    /**
     * Vector data.
     * @type {Array<number>}
     * @memberof UpdateRequest
     */
    values?: Array<number>;
    /**
     *
     * @type {SparseValues}
     * @memberof UpdateRequest
     */
    sparseValues?: SparseValues;
    /**
     * Metadata to set for the vector.
     * @type {object}
     * @memberof UpdateRequest
     */
    setMetadata?: object;
    /**
     * The namespace containing the vector to update.
     * @type {string}
     * @memberof UpdateRequest
     */
    namespace?: string;
}
/**
 * Check if a given object implements the UpdateRequest interface.
 */
export declare function instanceOfUpdateRequest(value: object): boolean;
export declare function UpdateRequestFromJSON(json: any): UpdateRequest;
export declare function UpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateRequest;
export declare function UpdateRequestToJSON(value?: UpdateRequest | null): any;