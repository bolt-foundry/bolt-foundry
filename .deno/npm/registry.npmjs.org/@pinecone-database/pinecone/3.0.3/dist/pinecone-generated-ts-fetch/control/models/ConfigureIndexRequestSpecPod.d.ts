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
 * @interface ConfigureIndexRequestSpecPod
 */
export interface ConfigureIndexRequestSpecPod {
    /**
     * The number of replicas. Replicas duplicate your index. They provide higher availability and throughput. Replicas can be scaled up or down as your needs change.
     * @type {number}
     * @memberof ConfigureIndexRequestSpecPod
     */
    replicas?: number;
    /**
     * The type of pod to use. One of `s1`, `p1`, or `p2` appended with `.` and one of `x1`, `x2`, `x4`, or `x8`.
     * @type {string}
     * @memberof ConfigureIndexRequestSpecPod
     */
    podType?: string;
}
/**
 * Check if a given object implements the ConfigureIndexRequestSpecPod interface.
 */
export declare function instanceOfConfigureIndexRequestSpecPod(value: object): boolean;
export declare function ConfigureIndexRequestSpecPodFromJSON(json: any): ConfigureIndexRequestSpecPod;
export declare function ConfigureIndexRequestSpecPodFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigureIndexRequestSpecPod;
export declare function ConfigureIndexRequestSpecPodToJSON(value?: ConfigureIndexRequestSpecPod | null): any;
