export var NexusTypes;
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
})(NexusTypes || (NexusTypes = {}));
export const NexusWrappedSymbol = Symbol.for('@nexus/wrapped');
export function withNexusSymbol(obj, nexusType) {
    obj.prototype[NexusWrappedSymbol] = nexusType;
}
//# sourceMappingURL=_types.js.map