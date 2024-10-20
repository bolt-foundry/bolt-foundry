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
import * as runtime from '../runtime';
import type { EmbedRequest, EmbeddingsList } from '../models/index';
export interface EmbedOperationRequest {
    embedRequest?: EmbedRequest;
}
/**
 *
 */
export declare class InferenceApi extends runtime.BaseAPI {
    /**
     * Generate embeddings for input data
     * Embed data
     */
    embedRaw(requestParameters: EmbedOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<EmbeddingsList>>;
    /**
     * Generate embeddings for input data
     * Embed data
     */
    embed(requestParameters?: EmbedOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<EmbeddingsList>;
}
