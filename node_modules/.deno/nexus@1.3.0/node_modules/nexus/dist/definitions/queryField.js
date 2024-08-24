"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryField = void 0;
const extendType_1 = require("./extendType");
function queryField(...args) {
    return (0, extendType_1.extendType)({
        type: 'Query',
        definition(t) {
            if (typeof args[0] === 'function') {
                return args[0](t);
            }
            const [fieldName, config] = args;
            const finalConfig = typeof config === 'function' ? config() : config;
            t.field(fieldName, finalConfig);
        },
    });
}
exports.queryField = queryField;
//# sourceMappingURL=queryField.js.map