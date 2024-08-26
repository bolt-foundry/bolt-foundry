"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NexusSchemaExtension = exports.NexusInterfaceTypeExtension = exports.NexusObjectTypeExtension = exports.NexusInputObjectTypeExtension = exports.NexusFieldExtension = exports.hasNexusExtension = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
/** @internal */
function hasNexusExtension(val) {
    return Boolean(val);
}
exports.hasNexusExtension = hasNexusExtension;
/** Container object living on `fieldDefinition.extensions.nexus` */
class NexusFieldExtension {
    constructor(config) {
        const { resolve } = config, rest = (0, tslib_1.__rest)(config, ["resolve"]);
        this.config = rest;
        this.hasDefinedResolver = Boolean(resolve && resolve !== graphql_1.defaultFieldResolver);
    }
    /** Called when there are modifications on the interface fields */
    modify(modifications) {
        return new NexusFieldExtension(Object.assign(Object.assign({}, this.config), modifications));
    }
}
exports.NexusFieldExtension = NexusFieldExtension;
/** Container object living on `inputObjectType.extensions.nexus` */
class NexusInputObjectTypeExtension {
    constructor(config) {
        const { definition } = config, rest = (0, tslib_1.__rest)(config, ["definition"]);
        this.config = rest;
    }
}
exports.NexusInputObjectTypeExtension = NexusInputObjectTypeExtension;
/** Container object living on `objectType.extensions.nexus` */
class NexusObjectTypeExtension {
    constructor(config) {
        const { definition } = config, rest = (0, tslib_1.__rest)(config, ["definition"]);
        this.config = rest;
    }
}
exports.NexusObjectTypeExtension = NexusObjectTypeExtension;
/** Container object living on `interfaceType.extensions.nexus` */
class NexusInterfaceTypeExtension {
    constructor(config) {
        const { definition } = config, rest = (0, tslib_1.__rest)(config, ["definition"]);
        this.config = rest;
    }
}
exports.NexusInterfaceTypeExtension = NexusInterfaceTypeExtension;
/**
 * Container object living on `schema.extensions.nexus`. Keeps track of metadata from the builder so we can
 * use it when we
 */
class NexusSchemaExtension {
    constructor(config) {
        this.config = config;
    }
}
exports.NexusSchemaExtension = NexusSchemaExtension;
//# sourceMappingURL=extensions.js.map