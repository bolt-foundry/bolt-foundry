"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withNexusSymbol = exports.NexusWrappedSymbol = exports.NexusTypes = void 0;
var NexusTypes;
(function (NexusTypes) {
    NexusTypes["Arg"] = "Arg";
    NexusTypes["DynamicInput"] = "DynamicInput";
    NexusTypes["DynamicOutputMethod"] = "DynamicOutputMethod";
    NexusTypes["DynamicOutputProperty"] = "DynamicOutputProperty";
    NexusTypes["Enum"] = "Enum";
    NexusTypes["ExtendInputObject"] = "ExtendInputObject";
    NexusTypes["ExtendObject"] = "ExtendObject";
    NexusTypes["InputField"] = "InputField";
    NexusTypes["InputObject"] = "InputObject";
    NexusTypes["Interface"] = "Interface";
    NexusTypes["List"] = "List";
    NexusTypes["NonNull"] = "NonNull";
    NexusTypes["Null"] = "Null";
    NexusTypes["Object"] = "Object";
    NexusTypes["OutputField"] = "OutputField";
    NexusTypes["Plugin"] = "Plugin";
    NexusTypes["PrintedGenTyping"] = "PrintedGenTyping";
    NexusTypes["PrintedGenTypingImport"] = "PrintedGenTypingImport";
    NexusTypes["Scalar"] = "Scalar";
    NexusTypes["Union"] = "Union";
})(NexusTypes = exports.NexusTypes || (exports.NexusTypes = {}));
exports.NexusWrappedSymbol = Symbol.for('@nexus/wrapped');
function withNexusSymbol(obj, nexusType) {
    obj.prototype[exports.NexusWrappedSymbol] = nexusType;
}
exports.withNexusSymbol = withNexusSymbol;
//# sourceMappingURL=_types.js.map