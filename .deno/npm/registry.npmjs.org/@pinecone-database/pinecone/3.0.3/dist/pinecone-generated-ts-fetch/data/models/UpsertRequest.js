"use strict";
/* tslint:disable */
/* eslint-disable */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertRequestToJSON = exports.UpsertRequestFromJSONTyped = exports.UpsertRequestFromJSON = exports.instanceOfUpsertRequest = void 0;
var runtime_1 = require("../runtime");
var Vector_1 = require("./Vector");
/**
 * Check if a given object implements the UpsertRequest interface.
 */
function instanceOfUpsertRequest(value) {
    var isInstance = true;
    isInstance = isInstance && 'vectors' in value;
    return isInstance;
}
exports.instanceOfUpsertRequest = instanceOfUpsertRequest;
function UpsertRequestFromJSON(json) {
    return UpsertRequestFromJSONTyped(json, false);
}
exports.UpsertRequestFromJSON = UpsertRequestFromJSON;
function UpsertRequestFromJSONTyped(json, ignoreDiscriminator) {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        vectors: json['vectors'].map(Vector_1.VectorFromJSON),
        namespace: !(0, runtime_1.exists)(json, 'namespace') ? undefined : json['namespace'],
    };
}
exports.UpsertRequestFromJSONTyped = UpsertRequestFromJSONTyped;
function UpsertRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        vectors: value.vectors.map(Vector_1.VectorToJSON),
        namespace: value.namespace,
    };
}
exports.UpsertRequestToJSON = UpsertRequestToJSON;
//# sourceMappingURL=UpsertRequest.js.map