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
exports.RpcStatusToJSON = exports.RpcStatusFromJSONTyped = exports.RpcStatusFromJSON = exports.instanceOfRpcStatus = void 0;
var runtime_1 = require("../runtime");
var ProtobufAny_1 = require("./ProtobufAny");
/**
 * Check if a given object implements the RpcStatus interface.
 */
function instanceOfRpcStatus(value) {
    var isInstance = true;
    return isInstance;
}
exports.instanceOfRpcStatus = instanceOfRpcStatus;
function RpcStatusFromJSON(json) {
    return RpcStatusFromJSONTyped(json, false);
}
exports.RpcStatusFromJSON = RpcStatusFromJSON;
function RpcStatusFromJSONTyped(json, ignoreDiscriminator) {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        code: !(0, runtime_1.exists)(json, 'code') ? undefined : json['code'],
        message: !(0, runtime_1.exists)(json, 'message') ? undefined : json['message'],
        details: !(0, runtime_1.exists)(json, 'details')
            ? undefined
            : json['details'].map(ProtobufAny_1.ProtobufAnyFromJSON),
    };
}
exports.RpcStatusFromJSONTyped = RpcStatusFromJSONTyped;
function RpcStatusToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        code: value.code,
        message: value.message,
        details: value.details === undefined
            ? undefined
            : value.details.map(ProtobufAny_1.ProtobufAnyToJSON),
    };
}
exports.RpcStatusToJSON = RpcStatusToJSON;
//# sourceMappingURL=RpcStatus.js.map