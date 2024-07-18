"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Client: () => Client,
  StreamRequestError: () => StreamRequestError
});
module.exports = __toCommonJS(src_exports);

// src/client.ts
var import_stream = require("stream");
var import_storage2 = require("@google-cloud/storage");

// src/config.ts
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var REPLIT_DEFAULT_BUCKET_URL = REPLIT_SIDECAR_ENDPOINT + "/object-storage/default-bucket";
var REPLIT_CREDENTIAL_URL = REPLIT_SIDECAR_ENDPOINT + "/credential";
var REPLIT_TOKEN_URL = REPLIT_SIDECAR_ENDPOINT + "/token";
var REPLIT_ADC = {
  audience: "replit",
  subject_token_type: "access_token",
  token_url: REPLIT_TOKEN_URL,
  type: "external_account",
  credential_source: {
    url: REPLIT_CREDENTIAL_URL,
    format: {
      type: "json",
      subject_token_field_name: "access_token"
    }
  },
  universe_domain: "googleapis.com"
};

// src/gcsApi.ts
var import_storage = require("@google-cloud/storage");

// src/result.ts
function Err(error, errorExtras) {
  return { ok: false, error, errorExtras };
}
function Ok(value) {
  return { ok: true, value };
}

// src/gcsApi.ts
function errFromGoogleErr(error) {
  if (error instanceof import_storage.ApiError) {
    return Err({
      message: error.message,
      statusCode: error.code
    });
  } else if (error instanceof Error) {
    return Err({
      message: error.toString()
    });
  }
  return Err({
    message: "An unknown error occurred."
  });
}
function parseFile(file) {
  return {
    name: file.name
  };
}

// src/sidecar.ts
async function getDefaultBucketId() {
  const response = await fetch(REPLIT_DEFAULT_BUCKET_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch default bucket, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const defaultBucketResponse = await response.json();
  if (typeof defaultBucketResponse !== "object" || !defaultBucketResponse || !("bucketId" in defaultBucketResponse) || typeof defaultBucketResponse.bucketId !== "string") {
    throw new Error(
      "Failed to fetch default bucket, make sure you're running on Replit"
    );
  }
  return defaultBucketResponse.bucketId;
}

// src/client.ts
var Client = class {
  /**
   * @hidden
   */
  state;
  /**
   * Creates a new client.
   * @param options - configurations to setup the client.
   */
  constructor(options) {
    this.state = {
      status: "initializing" /* Initializing */,
      promise: this.init(options?.bucketId)
    };
  }
  async init(bucketId) {
    try {
      const gcsClient = new import_storage2.Storage({
        credentials: REPLIT_ADC,
        projectId: ""
      });
      const bucket = gcsClient.bucket(bucketId ?? await getDefaultBucketId());
      this.state = {
        status: "ready" /* Ready */,
        bucket
      };
      return bucket;
    } catch (e) {
      this.state = {
        status: "error" /* Error */,
        error: e instanceof Error ? `Error during client initialization: ${e.message}` : "Unknown error"
      };
      throw e;
    }
  }
  async getBucket() {
    if (this.state.status === "initializing" /* Initializing */) {
      return this.state.promise;
    }
    if (this.state.status === "error" /* Error */) {
      throw new Error(this.state.error);
    }
    return this.state.bucket;
  }
  mapUploadOptions(options) {
    if (!options) {
      return;
    }
    const gzip = options.compress;
    return { gzip };
  }
  /**
   * Copies the specified object within the same bucket.
   * If an object exists in the same location, it will be overwritten.
   * @param objectName - The full path of the object to copy.
   * @param destObjectName - The full path to copy the object to.
   */
  async copy(objectName, destObjectName) {
    const bucket = await this.getBucket();
    try {
      await bucket.file(objectName).copy(destObjectName);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }
  /**
   * Deletes the specified object.
   * @param objectName - The full path of the object to delete.
   * @param options - Configurations for the delete operation.
   */
  async delete(objectName, options) {
    const bucket = await this.getBucket();
    try {
      await bucket.file(objectName).delete(options);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }
  /**
   * Downloads an object as a buffer containing the object's raw contents.
   * @param objectName - The full path of the object to download.
   * @param options - Configurations for the download operation.
   */
  async downloadAsBytes(objectName, options) {
    const bucket = await this.getBucket();
    try {
      const buffer = await bucket.file(objectName).download(options);
      return Ok(buffer);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }
  /**
   * Downloads a object to a string and returns the string.
   * @param objectName - The full path of the object to download.
   * @param options - Configurations for the download operation.
   */
  async downloadAsText(objectName, options) {
    const bucket = await this.getBucket();
    try {
      const buffer = await bucket.file(objectName).download(options);
      const text = buffer.toString();
      return Ok(text);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }
  /**
   * Downloads an object to the local filesystem.
   * @param objectName - The full path of the object to download.
   * @param destFilename - The path on the local filesystem to write the downloaded object to.
   * @param options - Configurations for the download operation.
   */
  async downloadToFilename(objectName, destFilename, options) {
    const bucket = await this.getBucket();
    bucket.file(objectName).createReadStream();
    try {
      await bucket.file(objectName).download({
        ...options,
        destination: destFilename
      });
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }
  /**
   * Opens a new stream and streams the object's contents.
   * If an error is encountered, it will be emitted through the stream.
   * @param objectName - The full path of the object to download.
   * @param options - Configurations for the download operation.
   */
  downloadAsStream(objectName, options) {
    const passThrough = new import_stream.PassThrough();
    this.getBucket().then((bucket) => {
      bucket.file(objectName).createReadStream(options).on("error", (err) => {
        const { error: reqErr } = errFromGoogleErr(err);
        passThrough.emit("error", new StreamRequestError(reqErr));
      }).pipe(passThrough);
    }).catch((err) => {
      const { error: reqErr } = errFromGoogleErr(err);
      passThrough.emit("error", new StreamRequestError(reqErr));
    });
    return passThrough;
  }
  /**
   * Checks whether the given object exists.
   * @param objectName - The full path of the object to check.
   */
  async exists(objectName) {
    const bucket = await this.getBucket();
    try {
      const response = await bucket.file(objectName).exists();
      return Ok(response[0]);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }
  /**
   * Lists objects in the bucket.
   * @param options - Configurations for the list operation.
   */
  async list(options) {
    const bucket = await this.getBucket();
    try {
      const [googleFiles] = await bucket.getFiles({
        ...options,
        autoPaginate: true,
        versions: false
      });
      const objects = googleFiles.map(parseFile);
      return Ok(objects);
    } catch (error) {
      return errFromGoogleErr(error);
    }
  }
  /**
   * Uploads an object from its in-memory byte representation.
   * If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param contents - The raw contents of the object in byte form.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromBytes(objectName, contents, options) {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.file(objectName).save(contents, mappedOptions);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }
  /**
   * Uploads an object from its in-memory text representation.
   * If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param contents - The contents of the object in text form.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromText(objectName, contents, options) {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.file(objectName).save(contents, mappedOptions);
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }
  /**
   * Uploads an object from a file on the local filesystem.
   * If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param srcFilename - The path of the file on the local filesystem to upload.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromFilename(objectName, srcFilename, options) {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    try {
      await bucket.upload(srcFilename, {
        ...mappedOptions,
        destination: objectName
      });
    } catch (error) {
      return errFromGoogleErr(error);
    }
    return Ok(null);
  }
  /**
   * Uploads an object by streaming its contents from the provided stream.
   * If an error is encountered, it will be emitted through the stream. If an object already exists with the specified name it will be overwritten.
   * @param objectName - The full destination path of the object.
   * @param stream - A writeable stream the object will be written from.
   * @param options - Configurations for the upload operation.
   */
  async uploadFromStream(objectName, stream, options) {
    const bucket = await this.getBucket();
    const mappedOptions = this.mapUploadOptions(options);
    return new Promise((resolve, reject) => {
      stream.pipe(
        bucket.file(objectName).createWriteStream({ ...mappedOptions, resumable: false })
      ).on("error", (err) => {
        const { error: reqErr } = errFromGoogleErr(err);
        reject(new StreamRequestError(reqErr));
      }).on("finish", () => {
        resolve();
      });
    });
  }
};

// src/index.ts
var StreamRequestError = class extends Error {
  requestError;
  constructor(err) {
    if (err.statusCode) {
      super(`${err.statusCode}: ${err.message}`);
    } else {
      super(err.message);
    }
    this.requestError = err;
  }
  getRequestError() {
    return this.requestError;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client,
  StreamRequestError
});
//# sourceMappingURL=index.js.map