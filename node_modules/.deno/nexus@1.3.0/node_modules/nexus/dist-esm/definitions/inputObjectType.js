import { assertValidName } from 'graphql';
import { arg } from './args';
import { NexusTypes, withNexusSymbol } from './_types';
export class NexusInputObjectTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        assertValidName(name);
    }
    get value() {
        return this.config;
    }
    /**
     * Shorthand for wrapping the current InputObject in an "arg", useful if you need to add a description.
     *
     * @example
     *   inputObject(config).asArg({
     *     description: 'Define sort the current field',
     *   })
     */
    asArg(cfg) {
        return arg(Object.assign(Object.assign({}, cfg), { type: this }));
    }
}
withNexusSymbol(NexusInputObjectTypeDef, NexusTypes.InputObject);
export function inputObjectType(config) {
    return new NexusInputObjectTypeDef(config.name, config);
}
//# sourceMappingURL=inputObjectType.js.map