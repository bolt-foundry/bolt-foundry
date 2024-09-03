import { Readable } from 'stream';

/**
 * A Result type that can be used to represent a successful value or an error.
 * It forces the consumer to check whether the returned type is an error or not,
 * `result.ok` acts as a discriminant between success and failure
 * @public
 * @typeParam T - The type of the result's value.
 * @typeParam E - The type of the result's error.
 * @typeParam ErrorExtras - The type of additional error info, if any will be returned.
 */
type Result<T, E = Error | string, ErrorExtras = unknown> = OkResult<T> | ErrResult<E, ErrorExtras>;
/**
 * Represents a successful result
 * @public
 * @typeParam T - The type of the result's value.
 */
interface OkResult<T> {
    /**
     * Indicates that the request was successful.
     */
    ok: true;
    /**
     * The value returned by the request.
     */
    value: T;
    /**
     * Always undefined when the request was successful.
     */
    error?: undefined;
}
/**
 * Represents a failure result
 * @public
 * @typeParam E - The type of the error.
 * @typeParam ErrorExtras - The type of any additional information on the error, if provided.
 */
interface ErrResult<E, ErrorExtras = unknown> {
    /**
     * Indicates that the request was unsuccessful.
     */
    ok: false;
    /**
     * The error that occurred.
     */
    error: E;
    /**
     * Always undefined when the request was successful.
     */
    value?: undefined;
    /**
     * Additional information on the error, if applicable.
     */
    errorExtras?: ErrorExtras;
}

/**
 * Configuration options for client creation.
 * @public
 */
interface ClientOptions {
    /**
     * The ID of the bucket the client will interact with.
     * If none is specified, the default bucket will be used.
     * @public
     */
    bucketId?: string;
}
/**
 * Configuration options for object deletion.
 * @public
 */
interface DeleteOptions {
    /**
     * If specified, no error will be raised if the specified object does not exist.
     * False by default.
     */
    ignoreNotFound?: boolean;
}
/**
 * Configuration options for object download.
 * @public
 */
interface DownloadOptions {
    /**
     * Whether the object should be decompressed, if uploaded using the `compress` flag.
     * True by default.
     */
    decompress?: boolean;
}
/**
 * Configuration options for listing objects in a bucket.
 * @public
 */
interface ListOptions {
    /**
     * Filter results to objects whose names are
     * lexicographically before endOffset. If startOffset is also set, the objects
     * listed have names between startOffset (inclusive) and endOffset (exclusive).
     */
    endOffset?: string;
    /**
     * Glob pattern used to filter results, for example foo*bar.
     */
    matchGlob?: string;
    /**
     * The maximum number of results that can be returned in the response.
     */
    maxResults?: number;
    /**
     * Filter results to objects who names have the specified prefix.
     */
    prefix?: string;
    /**
     * Filter results to objects whose names are
     * lexicographically equal to or after startOffset. If endOffset is also set,
     * the objects listed have names between startOffset (inclusive) and endOffset (exclusive).
     */
    startOffset?: string;
}
/**
 * Configuration options for object upload.
 * @public
 */
interface UploadOptions {
    /**
     * Whether the object should be compressed upon receipt of data.
     * This reduces at-rest storage cost but does not impact data transfer.
     * True by default.
     */
    compress?: boolean;
}
/**
 * Class representing a client to communicate with Object Storage from Replit.
 * @public
 */
declare class Client {
    /**
     * @hidden
     */
    private state;
    /**
     * Creates a new client.
     * @param options - configurations to setup the client.
     */
    constructor(options?: ClientOptions);
    private init;
    private getBucket;
    private mapUploadOptions;
    /**
     * Copies the specified object within the same bucket.
     * If an object exists in the same location, it will be overwritten.
     * @param objectName - The full path of the object to copy.
     * @param destObjectName - The full path to copy the object to.
     */
    copy(objectName: string, destObjectName: string): Promise<Result<null, RequestError>>;
    /**
     * Deletes the specified object.
     * @param objectName - The full path of the object to delete.
     * @param options - Configurations for the delete operation.
     */
    delete(objectName: string, options?: DeleteOptions): Promise<Result<null, RequestError>>;
    /**
     * Downloads an object as a buffer containing the object's raw contents.
     * @param objectName - The full path of the object to download.
     * @param options - Configurations for the download operation.
     */
    downloadAsBytes(objectName: string, options?: DownloadOptions): Promise<Result<[Buffer], RequestError>>;
    /**
     * Downloads a object to a string and returns the string.
     * @param objectName - The full path of the object to download.
     * @param options - Configurations for the download operation.
     */
    downloadAsText(objectName: string, options?: DownloadOptions): Promise<Result<string, RequestError>>;
    /**
     * Downloads an object to the local filesystem.
     * @param objectName - The full path of the object to download.
     * @param destFilename - The path on the local filesystem to write the downloaded object to.
     * @param options - Configurations for the download operation.
     */
    downloadToFilename(objectName: string, destFilename: string, options?: DownloadOptions): Promise<Result<null, RequestError>>;
    /**
     * Opens a new stream and streams the object's contents.
     * If an error is encountered, it will be emitted through the stream.
     * @param objectName - The full path of the object to download.
     * @param options - Configurations for the download operation.
     */
    downloadAsStream(objectName: string, options?: DownloadOptions): Readable;
    /**
     * Checks whether the given object exists.
     * @param objectName - The full path of the object to check.
     */
    exists(objectName: string): Promise<Result<boolean, RequestError>>;
    /**
     * Lists objects in the bucket.
     * @param options - Configurations for the list operation.
     */
    list(options?: ListOptions): Promise<Result<Array<StorageObject>, RequestError>>;
    /**
     * Uploads an object from its in-memory byte representation.
     * If an object already exists with the specified name it will be overwritten.
     * @param objectName - The full destination path of the object.
     * @param contents - The raw contents of the object in byte form.
     * @param options - Configurations for the upload operation.
     */
    uploadFromBytes(objectName: string, contents: Buffer, options?: UploadOptions): Promise<Result<null, RequestError>>;
    /**
     * Uploads an object from its in-memory text representation.
     * If an object already exists with the specified name it will be overwritten.
     * @param objectName - The full destination path of the object.
     * @param contents - The contents of the object in text form.
     * @param options - Configurations for the upload operation.
     */
    uploadFromText(objectName: string, contents: string, options?: UploadOptions): Promise<Result<null, RequestError>>;
    /**
     * Uploads an object from a file on the local filesystem.
     * If an object already exists with the specified name it will be overwritten.
     * @param objectName - The full destination path of the object.
     * @param srcFilename - The path of the file on the local filesystem to upload.
     * @param options - Configurations for the upload operation.
     */
    uploadFromFilename(objectName: string, srcFilename: string, options?: UploadOptions): Promise<Result<null, RequestError>>;
    /**
     * Uploads an object by streaming its contents from the provided stream.
     * If an error is encountered, it will be emitted through the stream. If an object already exists with the specified name it will be overwritten.
     * @param objectName - The full destination path of the object.
     * @param stream - A writeable stream the object will be written from.
     * @param options - Configurations for the upload operation.
     */
    uploadFromStream(objectName: string, stream: Readable, options?: UploadOptions): Promise<void>;
}

/**
 * Metadata for an object.
 * @public
 */
interface StorageObject {
    /**
     * The name of the object, including its full path.
     */
    name: string;
}
/**
 * An object that represents an error with a request
 * @public
 */
interface RequestError {
    message: string;
    statusCode?: number;
}
/**
 * An error that may be surfaced when using a stream.
 * @public
 */
declare class StreamRequestError extends Error {
    private requestError;
    constructor(err: RequestError);
    getRequestError(): RequestError;
}

export { Client, ClientOptions, DeleteOptions, DownloadOptions, ErrResult, ListOptions, OkResult, RequestError, Result, StorageObject, StreamRequestError, UploadOptions };
