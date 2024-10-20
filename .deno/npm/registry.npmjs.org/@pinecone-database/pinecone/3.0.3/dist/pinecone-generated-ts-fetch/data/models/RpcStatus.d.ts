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
import type { ProtobufAny } from './ProtobufAny';
/**
 *
 * @export
 * @interface RpcStatus
 */
export interface RpcStatus {
    /**
     *
     * @type {number}
     * @memberof RpcStatus
     */
    code?: number;
    /**
     *
     * @type {string}
     * @memberof RpcStatus
     */
    message?: string;
    /**
     *
     * @type {Array<ProtobufAny>}
     * @memberof RpcStatus
     */
    details?: Array<ProtobufAny>;
}
/**
 * Check if a given object implements the RpcStatus interface.
 */
export declare function instanceOfRpcStatus(value: object): boolean;
export declare function RpcStatusFromJSON(json: any): RpcStatus;
export declare function RpcStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): RpcStatus;
export declare function RpcStatusToJSON(value?: RpcStatus | null): any;
