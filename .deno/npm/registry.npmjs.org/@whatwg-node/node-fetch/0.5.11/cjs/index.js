"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLSearchParams = exports.URL = exports.btoa = exports.TextDecoder = exports.TextEncoder = exports.Blob = exports.FormData = exports.File = exports.ReadableStream = exports.Response = exports.Request = exports.Body = exports.Headers = exports.fetch = void 0;
var fetch_js_1 = require("./fetch.js");
Object.defineProperty(exports, "fetch", { enumerable: true, get: function () { return fetch_js_1.fetchPonyfill; } });
var Headers_js_1 = require("./Headers.js");
Object.defineProperty(exports, "Headers", { enumerable: true, get: function () { return Headers_js_1.PonyfillHeaders; } });
var Body_js_1 = require("./Body.js");
Object.defineProperty(exports, "Body", { enumerable: true, get: function () { return Body_js_1.PonyfillBody; } });
var Request_js_1 = require("./Request.js");
Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return Request_js_1.PonyfillRequest; } });
var Response_js_1 = require("./Response.js");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return Response_js_1.PonyfillResponse; } });
var ReadableStream_js_1 = require("./ReadableStream.js");
Object.defineProperty(exports, "ReadableStream", { enumerable: true, get: function () { return ReadableStream_js_1.PonyfillReadableStream; } });
var File_js_1 = require("./File.js");
Object.defineProperty(exports, "File", { enumerable: true, get: function () { return File_js_1.PonyfillFile; } });
var FormData_js_1 = require("./FormData.js");
Object.defineProperty(exports, "FormData", { enumerable: true, get: function () { return FormData_js_1.PonyfillFormData; } });
var Blob_js_1 = require("./Blob.js");
Object.defineProperty(exports, "Blob", { enumerable: true, get: function () { return Blob_js_1.PonyfillBlob; } });
var TextEncoderDecoder_js_1 = require("./TextEncoderDecoder.js");
Object.defineProperty(exports, "TextEncoder", { enumerable: true, get: function () { return TextEncoderDecoder_js_1.PonyfillTextEncoder; } });
Object.defineProperty(exports, "TextDecoder", { enumerable: true, get: function () { return TextEncoderDecoder_js_1.PonyfillTextDecoder; } });
Object.defineProperty(exports, "btoa", { enumerable: true, get: function () { return TextEncoderDecoder_js_1.PonyfillBtoa; } });
var URL_js_1 = require("./URL.js");
Object.defineProperty(exports, "URL", { enumerable: true, get: function () { return URL_js_1.PonyfillURL; } });
var URLSearchParams_js_1 = require("./URLSearchParams.js");
Object.defineProperty(exports, "URLSearchParams", { enumerable: true, get: function () { return URLSearchParams_js_1.PonyfillURLSearchParams; } });