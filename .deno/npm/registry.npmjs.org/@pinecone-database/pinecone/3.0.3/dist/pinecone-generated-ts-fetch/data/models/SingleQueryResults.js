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
exports.SingleQueryResultsToJSON = exports.SingleQueryResultsFromJSONTyped = exports.SingleQueryResultsFromJSON = exports.instanceOfSingleQueryResults = void 0;
var runtime_1 = require("../runtime");
var ScoredVector_1 = require("./ScoredVector");
/**
 * Check if a given object implements the SingleQueryResults interface.
 */
function instanceOfSingleQueryResults(value) {
    var isInstance = true;
    return isInstance;
}
exports.instanceOfSingleQueryResults = instanceOfSingleQueryResults;
function SingleQueryResultsFromJSON(json) {
    return SingleQueryResultsFromJSONTyped(json, false);
}
exports.SingleQueryResultsFromJSON = SingleQueryResultsFromJSON;
function SingleQueryResultsFromJSONTyped(json, ignoreDiscriminator) {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        matches: !(0, runtime_1.exists)(json, 'matches')
            ? undefined
            : json['matches'].map(ScoredVector_1.ScoredVectorFromJSON),
        namespace: !(0, runtime_1.exists)(json, 'namespace') ? undefined : json['namespace'],
    };
}
exports.SingleQueryResultsFromJSONTyped = SingleQueryResultsFromJSONTyped;
function SingleQueryResultsToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        matches: value.matches === undefined
            ? undefined
            : value.matches.map(ScoredVector_1.ScoredVectorToJSON),
        namespace: value.namespace,
    };
}
exports.SingleQueryResultsToJSON = SingleQueryResultsToJSON;
//# sourceMappingURL=SingleQueryResults.js.map