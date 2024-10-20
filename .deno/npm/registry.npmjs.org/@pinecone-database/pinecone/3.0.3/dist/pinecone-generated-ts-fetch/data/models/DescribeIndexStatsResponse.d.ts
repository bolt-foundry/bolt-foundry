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
import type { NamespaceSummary } from './NamespaceSummary';
/**
 * The response for the `describe_index_stats` operation.
 * @export
 * @interface DescribeIndexStatsResponse
 */
export interface DescribeIndexStatsResponse {
    /**
     * A mapping for each namespace in the index from the namespace name to a summary of its contents. If a metadata filter expression is present, the summary will reflect only vectors matching that expression.
     * @type {{ [key: string]: NamespaceSummary; }}
     * @memberof DescribeIndexStatsResponse
     */
    namespaces?: {
        [key: string]: NamespaceSummary;
    };
    /**
     * The dimension of the indexed vectors.
     * @type {number}
     * @memberof DescribeIndexStatsResponse
     */
    dimension?: number;
    /**
     * The fullness of the index, regardless of whether a metadata filter expression was passed. The granularity of this metric is 10%.
     *
     * Serverless indexes scale automatically as needed, so index fullness  is relevant only for pod-based indexes.
     *
     * The index fullness result may be inaccurate during pod resizing; to get the status of a pod resizing process, use [`describe_index`](https://docs.pinecone.io/reference/api/control-plane/describe_index).
     * @type {number}
     * @memberof DescribeIndexStatsResponse
     */
    indexFullness?: number;
    /**
     * The total number of vectors in the index, regardless of whether a metadata filter expression was passed
     * @type {number}
     * @memberof DescribeIndexStatsResponse
     */
    totalVectorCount?: number;
}
/**
 * Check if a given object implements the DescribeIndexStatsResponse interface.
 */
export declare function instanceOfDescribeIndexStatsResponse(value: object): boolean;
export declare function DescribeIndexStatsResponseFromJSON(json: any): DescribeIndexStatsResponse;
export declare function DescribeIndexStatsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): DescribeIndexStatsResponse;
export declare function DescribeIndexStatsResponseToJSON(value?: DescribeIndexStatsResponse | null): any;
