"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = exports.isEdge = void 0;
var isEdge = function () {
    // This is the recommended way to detect
    // running in the Edge Runtime according
    // to Vercel docs.
    return typeof EdgeRuntime === 'string';
};
exports.isEdge = isEdge;
var isBrowser = function () {
    return typeof window !== 'undefined';
};
exports.isBrowser = isBrowser;
//# sourceMappingURL=environment.js.map