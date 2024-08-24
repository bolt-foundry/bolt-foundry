export function decorateType(type, config) {
    var _a;
    type.extensions = Object.assign(Object.assign({}, type.extensions), { nexus: Object.assign(Object.assign({}, Object((_a = type.extensions) === null || _a === void 0 ? void 0 : _a.nexus)), config) });
    return type;
}
//# sourceMappingURL=decorateType.js.map