"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicInputMethod = exports.dynamicOutputMethod = exports.DynamicOutputMethodDef = exports.DynamicInputMethodDef = void 0;
const _types_1 = require("./definitions/_types");
class DynamicInputMethodDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
    }
    get value() {
        return this.config;
    }
}
exports.DynamicInputMethodDef = DynamicInputMethodDef;
(0, _types_1.withNexusSymbol)(DynamicInputMethodDef, _types_1.NexusTypes.DynamicInput);
class DynamicOutputMethodDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
    }
    get value() {
        return this.config;
    }
}
exports.DynamicOutputMethodDef = DynamicOutputMethodDef;
(0, _types_1.withNexusSymbol)(DynamicOutputMethodDef, _types_1.NexusTypes.DynamicOutputMethod);
/**
 * Defines a new property on the object definition block for an output type, taking arbitrary input to define
 * additional types. See the connectionPlugin:
 *
 * T.connectionField('posts', { nullable: true, totalCount(root, args, ctx, info) { return
 * ctx.user.getTotalPostCount(root.id, args) }, nodes(root, args, ctx, info) { return
 * ctx.user.getPosts(root.id, args) } })
 */
function dynamicOutputMethod(config) {
    return new DynamicOutputMethodDef(config.name, config);
}
exports.dynamicOutputMethod = dynamicOutputMethod;
/** Same as the outputFieldExtension, but for fields that should be added on as input types. */
function dynamicInputMethod(config) {
    return new DynamicInputMethodDef(config.name, config);
}
exports.dynamicInputMethod = dynamicInputMethod;
//# sourceMappingURL=dynamicMethod.js.map