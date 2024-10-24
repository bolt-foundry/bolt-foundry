"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonStringifyResultWithoutInternals = jsonStringifyResultWithoutInternals;
exports.omitInternalsFromResultErrors = omitInternalsFromResultErrors;
const error_js_1 = require("../../error.js");
// JSON stringifier that adjusts the result error extensions while serialising
function jsonStringifyResultWithoutInternals(result) {
    if (Array.isArray(result)) {
        return `[${result
            .map(r => {
            const sanitizedResult = omitInternalsFromResultErrors(r);
            const stringifier = r.stringify || JSON.stringify;
            return stringifier(sanitizedResult);
        })
            .join(',')}]`;
    }
    const sanitizedResult = omitInternalsFromResultErrors(result);
    const stringifier = result.stringify || JSON.stringify;
    return stringifier(sanitizedResult);
}
function omitInternalsFromResultErrors(result) {
    if (result.errors?.length || result.extensions?.http) {
        const newResult = { ...result };
        newResult.errors &&= newResult.errors.map(omitInternalsFromError);
        if (newResult.extensions) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TS should check for unused vars instead
            const { http, ...extensions } = result.extensions;
            newResult.extensions = Object.keys(extensions).length ? extensions : undefined;
        }
        return newResult;
    }
    return result;
}
function omitInternalsFromError(err) {
    if ((0, error_js_1.isGraphQLError)(err)) {
        const serializedError = 'toJSON' in err && typeof err.toJSON === 'function' ? err.toJSON() : Object(err);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TS should check for unused vars instead
        const { http, unexpected, ...extensions } = serializedError.extensions || {};
        return (0, error_js_1.createGraphQLError)(err.message, {
            nodes: err.nodes,
            source: err.source,
            positions: err.positions,
            path: err.path,
            originalError: omitInternalsFromError(err.originalError || undefined),
            extensions: Object.keys(extensions).length ? extensions : undefined,
        });
    }
    return err;
}
