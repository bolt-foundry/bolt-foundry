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
exports.QueryResponseToJSON = exports.QueryResponseFromJSONTyped = exports.QueryResponseFromJSON = exports.instanceOfQueryResponse = void 0;
var runtime_1 = require("../runtime");
var ScoredVector_1 = require("./ScoredVector");
var SingleQueryResults_1 = require("./SingleQueryResults");
var Usage_1 = require("./Usage");
/**
 * Check if a given object implements the QueryResponse interface.
 */
function instanceOfQueryResponse(value) {
    var isInstance = true;
    return isInstance;
}
exports.instanceOfQueryResponse = instanceOfQueryResponse;
function QueryResponseFromJSON(json) {
    return QueryResponseFromJSONTyped(json, false);
}
exports.QueryResponseFromJSON = QueryResponseFromJSON;
function QueryResponseFromJSONTyped(json, ignoreDiscriminator) {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        results: !(0, runtime_1.exists)(json, 'results')
            ? undefined
            : json['results'].map(SingleQueryResults_1.SingleQueryResultsFromJSON),
        matches: !(0, runtime_1.exists)(json, 'matches')
            ? undefined
            : json['matches'].map(ScoredVector_1.ScoredVectorFromJSON),
        namespace: !(0, runtime_1.exists)(json, 'namespace') ? undefined : json['namespace'],
        usage: !(0, runtime_1.exists)(json, 'usage') ? undefined : (0, Usage_1.UsageFromJSON)(json['usage']),
    };
}
exports.QueryResponseFromJSONTyped = QueryResponseFromJSONTyped;
function QueryResponseToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        results: value.results === undefined
            ? undefined
            : value.results.map(SingleQueryResults_1.SingleQueryResultsToJSON),
        matches: value.matches === undefined
            ? undefined
            : value.matches.map(ScoredVector_1.ScoredVectorToJSON),
        namespace: value.namespace,
        usage: (0, Usage_1.UsageToJSON)(value.usage),
    };
}
exports.QueryResponseToJSON = QueryResponseToJSON;
//# sourceMappingURL=QueryResponse.js.map