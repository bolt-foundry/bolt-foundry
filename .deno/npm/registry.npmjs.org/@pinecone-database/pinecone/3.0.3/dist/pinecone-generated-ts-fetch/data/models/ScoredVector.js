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
exports.ScoredVectorToJSON = exports.ScoredVectorFromJSONTyped = exports.ScoredVectorFromJSON = exports.instanceOfScoredVector = void 0;
var runtime_1 = require("../runtime");
var SparseValues_1 = require("./SparseValues");
/**
 * Check if a given object implements the ScoredVector interface.
 */
function instanceOfScoredVector(value) {
    var isInstance = true;
    isInstance = isInstance && 'id' in value;
    return isInstance;
}
exports.instanceOfScoredVector = instanceOfScoredVector;
function ScoredVectorFromJSON(json) {
    return ScoredVectorFromJSONTyped(json, false);
}
exports.ScoredVectorFromJSON = ScoredVectorFromJSON;
function ScoredVectorFromJSONTyped(json, ignoreDiscriminator) {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        id: json['id'],
        score: !(0, runtime_1.exists)(json, 'score') ? undefined : json['score'],
        values: !(0, runtime_1.exists)(json, 'values') ? undefined : json['values'],
        sparseValues: !(0, runtime_1.exists)(json, 'sparseValues')
            ? undefined
            : (0, SparseValues_1.SparseValuesFromJSON)(json['sparseValues']),
        metadata: !(0, runtime_1.exists)(json, 'metadata') ? undefined : json['metadata'],
    };
}
exports.ScoredVectorFromJSONTyped = ScoredVectorFromJSONTyped;
function ScoredVectorToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        id: value.id,
        score: value.score,
        values: value.values,
        sparseValues: (0, SparseValues_1.SparseValuesToJSON)(value.sparseValues),
        metadata: value.metadata,
    };
}
exports.ScoredVectorToJSON = ScoredVectorToJSON;
//# sourceMappingURL=ScoredVector.js.map