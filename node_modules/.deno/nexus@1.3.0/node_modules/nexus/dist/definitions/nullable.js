"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullable = exports.NexusNullDef = void 0;
const graphql_1 = require("graphql");
const nexusMeta_1 = require("./nexusMeta");
const wrapping_1 = require("./wrapping");
const _types_1 = require("./_types");
class NexusNullDef {
    constructor(ofNexusType) {
        this.ofNexusType = ofNexusType;
        // @ts-ignore
        // Required field for TS to differentiate NonNull from Null from List
        this._isNexusNullDef = true;
        if (typeof ofNexusType !== 'string' &&
            !(0, wrapping_1.isNexusStruct)(ofNexusType) &&
            !(0, nexusMeta_1.isNexusMeta)(ofNexusType) &&
            !(0, graphql_1.isType)(ofNexusType)) {
            throw new Error('Cannot wrap unknown types in nullable(). Saw ' + ofNexusType);
        }
    }
}
exports.NexusNullDef = NexusNullDef;
(0, _types_1.withNexusSymbol)(NexusNullDef, _types_1.NexusTypes.Null);
/**
 * [API Docs](https://nxs.li/docs/api/nonNull) | [Nullability Guide](https://nxs.li/guides/nullability) |
 * [2018 GraphQL Spec](https://spec.graphql.org/June2018/#sec-Type-System.Non-Null)
 *
 * Remove the Non-Null wrapper from a type, if present.
 *
 * In Nexus input and output position types are nullable by default so this has ***no use*** until you've
 * changed the non-null defaults for one or both positions.
 *
 * If you find yourself using this a large majority of the time then consider changing your nullability defaults.
 *
 * @example
 *   objectType({
 *     name: 'User',
 *     nonNullDefaults: {
 *       inputs: true,
 *       outputs: true,
 *     },
 *     definition(t) {
 *       t.field('id', {
 *         type: 'ID',
 *       })
 *       t.field('bio', {
 *         args: {
 *           format: booleanArg(),
 *           maxWords: nullable(intArg()),
 *         },
 *         type: nullable('String'),
 *       })
 *     },
 *   })
 *
 *   // GraphQL SDL
 *   // -----------
 *   //
 *   // type User {
 *   //   id: ID!
 *   //   bio(maxWords: Int, format: Boolean!): String
 *   // }
 *
 * @param type The type to wrap in Non-Null. This may be expressed in one of three ways:
 *
 *   1. As string literals matching the name of a builtin scalar. E.g.: 'ID', 'String', ...
 *   2. As string literals matching the name of another type. E.g.: 'User', 'Location', ... Thanks to [Nexus'
 *        reflection system](https://nxs.li/guides/reflection) this is typesafe and autocompletable. This is
 *        the idiomatic approach in Nexus because it avoids excessive importing and circular references.
 *   3. As references to other enums or object type definitions. E.g.: User, Location
 *
 *   You may also use other type modifier helpers like list() which in turn accept one of the three
 */
function nullable(type) {
    if ((0, wrapping_1.isNexusNonNullTypeDef)(type)) {
        return new NexusNullDef(type.ofNexusType);
    }
    if ((0, wrapping_1.isNexusNullTypeDef)(type)) {
        return type;
    }
    return new NexusNullDef(type);
}
exports.nullable = nullable;
//# sourceMappingURL=nullable.js.map