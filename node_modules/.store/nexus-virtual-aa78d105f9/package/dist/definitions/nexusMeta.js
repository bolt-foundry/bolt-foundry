"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNexusMetaType = exports.isNexusMeta = exports.isNexusMetaTypeFn = exports.isNexusMetaTypeProp = exports.isNexusMetaType = exports.isNexusMetaBuild = exports.NEXUS_BUILD = exports.NEXUS_TYPE = void 0;
const utils_1 = require("../utils");
const wrapping_1 = require("./wrapping");
/** Symbol marking an object as something that can provide Nexus schema definitions */
exports.NEXUS_TYPE = Symbol.for('@nexus/meta/NEXUS_TYPE');
exports.NEXUS_BUILD = Symbol.for('@nexus/meta/NEXUS_BUILD');
function isNexusMetaBuild(obj) {
    return Boolean(obj && typeof utils_1.ownProp.get(obj, exports.NEXUS_BUILD) === 'function');
}
exports.isNexusMetaBuild = isNexusMetaBuild;
function isNexusMetaType(obj) {
    return isNexusMetaTypeProp(obj) || isNexusMetaTypeFn(obj);
}
exports.isNexusMetaType = isNexusMetaType;
function isNexusMetaTypeProp(obj) {
    return Boolean(obj && utils_1.ownProp.has(obj, exports.NEXUS_TYPE) && (0, wrapping_1.isNexusStruct)(utils_1.ownProp.get(obj, exports.NEXUS_TYPE)));
}
exports.isNexusMetaTypeProp = isNexusMetaTypeProp;
function isNexusMetaTypeFn(obj) {
    return Boolean(obj && utils_1.ownProp.has(obj, exports.NEXUS_TYPE) && typeof utils_1.ownProp.get(obj, exports.NEXUS_TYPE) === 'function');
}
exports.isNexusMetaTypeFn = isNexusMetaTypeFn;
function isNexusMeta(obj) {
    return isNexusMetaBuild(obj) || isNexusMetaType(obj) || isNexusMetaTypeFn(obj);
}
exports.isNexusMeta = isNexusMeta;
/**
 * Evaluates the thunk, replacing it with the type
 *
 * @param obj
 */
function resolveNexusMetaType(obj) {
    let value = utils_1.ownProp.get(obj, exports.NEXUS_TYPE);
    if (typeof value === 'function') {
        value = utils_1.ownProp.set(obj, exports.NEXUS_TYPE, value.call(obj));
    }
    if (!(0, wrapping_1.isNexusObjectTypeDef)(value) && !(0, wrapping_1.isNexusInterfaceTypeDef)(value)) {
        throw new Error(`Expected property of NEXUS_TYPE to be an object or interface type`);
    }
    return value;
}
exports.resolveNexusMetaType = resolveNexusMetaType;
//# sourceMappingURL=nexusMeta.js.map