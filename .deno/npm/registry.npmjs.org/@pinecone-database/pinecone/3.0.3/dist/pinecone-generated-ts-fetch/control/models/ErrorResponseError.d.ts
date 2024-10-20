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
 * Detailed information about the error that occurred.
 * @export
 * @interface ErrorResponseError
 */
export interface ErrorResponseError {
    /**
     *
     * @type {string}
     * @memberof ErrorResponseError
     */
    code: ErrorResponseErrorCodeEnum;
    /**
     *
     * @type {string}
     * @memberof ErrorResponseError
     */
    message: string;
    /**
     * Additional information about the error. This field is not guaranteed to be present.
     * @type {object}
     * @memberof ErrorResponseError
     */
    details?: object;
}
/**
 * @export
 */
export declare const ErrorResponseErrorCodeEnum: {
    readonly Ok: "OK";
    readonly Unknown: "UNKNOWN";
    readonly InvalidArgument: "INVALID_ARGUMENT";
    readonly DeadlineExceeded: "DEADLINE_EXCEEDED";
    readonly QuotaExceeded: "QUOTA_EXCEEDED";
    readonly NotFound: "NOT_FOUND";
    readonly AlreadyExists: "ALREADY_EXISTS";
    readonly PermissionDenied: "PERMISSION_DENIED";
    readonly Unauthenticated: "UNAUTHENTICATED";
    readonly ResourceExhausted: "RESOURCE_EXHAUSTED";
    readonly FailedPrecondition: "FAILED_PRECONDITION";
    readonly Aborted: "ABORTED";
    readonly OutOfRange: "OUT_OF_RANGE";
    readonly Unimplemented: "UNIMPLEMENTED";
    readonly Internal: "INTERNAL";
    readonly Unavailable: "UNAVAILABLE";
    readonly DataLoss: "DATA_LOSS";
    readonly Forbidden: "FORBIDDEN";
    readonly UnprocessableEntity: "UNPROCESSABLE_ENTITY";
};
export type ErrorResponseErrorCodeEnum = (typeof ErrorResponseErrorCodeEnum)[keyof typeof ErrorResponseErrorCodeEnum];
/**
 * Check if a given object implements the ErrorResponseError interface.
 */
export declare function instanceOfErrorResponseError(value: object): boolean;
export declare function ErrorResponseErrorFromJSON(json: any): ErrorResponseError;
export declare function ErrorResponseErrorFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorResponseError;
export declare function ErrorResponseErrorToJSON(value?: ErrorResponseError | null): any;
