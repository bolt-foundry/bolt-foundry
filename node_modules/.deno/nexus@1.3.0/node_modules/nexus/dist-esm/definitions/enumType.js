import { assertValidName } from 'graphql';
import { arg } from './args';
import { NexusTypes, withNexusSymbol } from './_types';
export class NexusEnumTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        assertValidName(name);
    }
    get value() {
        return this.config;
    }
    /**
     * Wraps the current enum as an argument, useful if you're defining the enumType inline for an individual field.
     *
     * @example
     *   args: {
     *     sort: enumType(config).asArg({ default: 'someValue' })
     *   }
     */
    asArg(cfg) {
        return arg(Object.assign(Object.assign({}, cfg), { type: this }));
    }
}
withNexusSymbol(NexusEnumTypeDef, NexusTypes.Enum);
export function enumType(config) {
    return new NexusEnumTypeDef(config.name, config);
}
//# sourceMappingURL=enumType.js.map