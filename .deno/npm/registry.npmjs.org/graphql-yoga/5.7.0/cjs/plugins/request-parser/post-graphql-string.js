"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPOSTGraphQLStringRequest = isPOSTGraphQLStringRequest;
exports.parsePOSTGraphQLStringRequest = parsePOSTGraphQLStringRequest;
const utils_js_1 = require("./utils.js");
function isPOSTGraphQLStringRequest(request) {
    return request.method === 'POST' && (0, utils_js_1.isContentTypeMatch)(request, 'application/graphql');
}
async function parsePOSTGraphQLStringRequest(request) {
    const requestBody = await request.text();
    return {
        query: requestBody,
    };
}
