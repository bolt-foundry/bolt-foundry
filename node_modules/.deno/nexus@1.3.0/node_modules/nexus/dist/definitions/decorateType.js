"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateType = void 0;
function decorateType(type, config) {
    var _a;
    type.extensions = Object.assign(Object.assign({}, type.extensions), { nexus: Object.assign(Object.assign({}, Object((_a = type.extensions) === null || _a === void 0 ? void 0 : _a.nexus)), config) });
    return type;
}
exports.decorateType = decorateType;
//# sourceMappingURL=decorateType.js.map