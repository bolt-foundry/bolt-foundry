"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPonyfill = fetchPonyfill;
const fs_1 = require("fs");
const url_1 = require("url");
const fetchCurl_js_1 = require("./fetchCurl.js");
const fetchNodeHttp_js_1 = require("./fetchNodeHttp.js");
const Request_js_1 = require("./Request.js");
const Response_js_1 = require("./Response.js");
const URL_js_1 = require("./URL.js");
const utils_js_1 = require("./utils.js");
const BASE64_SUFFIX = ';base64';
function getResponseForFile(url) {
    const path = (0, url_1.fileURLToPath)(url);
    const readable = (0, fs_1.createReadStream)(path);
    return new Response_js_1.PonyfillResponse(readable);
}
function getResponseForDataUri(url) {
    const [mimeType = 'text/plain', ...datas] = url.substring(5).split(',');
    const data = decodeURIComponent(datas.join(','));
    if (mimeType.endsWith(BASE64_SUFFIX)) {
        const buffer = Buffer.from(data, 'base64url');
        const realMimeType = mimeType.slice(0, -BASE64_SUFFIX.length);
        return new Response_js_1.PonyfillResponse(buffer, {
            status: 200,
            statusText: 'OK',
            headers: {
                'content-type': realMimeType,
            },
        });
    }
    return new Response_js_1.PonyfillResponse(data, {
        status: 200,
        statusText: 'OK',
        headers: {
            'content-type': mimeType,
        },
    });
}
function getResponseForBlob(url) {
    const blob = URL_js_1.PonyfillURL.getBlobFromURL(url);
    if (!blob) {
        throw new TypeError('Invalid Blob URL');
    }
    return new Response_js_1.PonyfillResponse(blob, {
        status: 200,
        headers: {
            'content-type': blob.type,
            'content-length': blob.size.toString(),
        },
    });
}
function isURL(obj) {
    return obj != null && obj.href != null;
}
function fetchPonyfill(info, init) {
    if (typeof info === 'string' || isURL(info)) {
        const ponyfillRequest = new Request_js_1.PonyfillRequest(info, init);
        return fetchPonyfill(ponyfillRequest);
    }
    const fetchRequest = info;
    if (fetchRequest.url.startsWith('data:')) {
        const response = getResponseForDataUri(fetchRequest.url);
        return (0, utils_js_1.fakePromise)(response);
    }
    if (fetchRequest.url.startsWith('file:')) {
        const response = getResponseForFile(fetchRequest.url);
        return (0, utils_js_1.fakePromise)(response);
    }
    if (fetchRequest.url.startsWith('blob:')) {
        const response = getResponseForBlob(fetchRequest.url);
        return (0, utils_js_1.fakePromise)(response);
    }
    if (globalThis.libcurl && !fetchRequest.agent) {
        return (0, fetchCurl_js_1.fetchCurl)(fetchRequest);
    }
    return (0, fetchNodeHttp_js_1.fetchNodeHttp)(fetchRequest);
}