import { assertValidName } from 'graphql';
import { NexusTypes, withNexusSymbol } from './_types';
export class NexusExtendTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
withNexusSymbol(NexusExtendTypeDef, NexusTypes.ExtendObject);
/**
 * [API Docs](https://nxs.li/docs/api/extend-type)
 *
 * Add new fields to an existing objectType.
 *
 * This is useful when splitting your schema's type definitions across modules wherein each module is
 * concerned with its own domain (User, Post, Comment, etc.). You may discover that some types are shared
 * across domains and you want to co-locate the definition of the field contributions to where the domains
 * they relate to are.
 *
 * A classic example is contributing fields to root types Query, Mutation, or Subscription. Note that this
 * use-case is so common Nexus ships dedicated functions for it: queryField, mutationField, subscriptionField.
 *
 * You can extend types before defining them strictly with objectType or the root field functions (queryType
 * etc.). The typing for "type" property will appear to suggest that you cannot, however once Nexus reflection
 * has run you'll see that the type you "extended" exists in the schema and that your static typing error has
 * been resolved. This behaviour is a convenience especially when extending root types which you might never
 * define in your schema directly.
 *
 * @example
 *   // types/User.ts
 *
 *   export const User = objectType({
 *     name: 'User',
 *     // ...
 *   })
 *
 *   // Remember: It does not matter if you have
 *   // used queryType(...) elsewhere or not.
 *
 *   export const UserQuery = extendType({
 *     type: 'Query',
 *     definition(t) {
 *       t.list.nonNull.field('users', {
 *         type: 'User',
 *         resolve() {
 *           return // ...
 *         },
 *       })
 *     },
 *   })
 *
 * @param config The specification of which type to extend and how. This is basically a subset of the
 *   configuration object passed to the objectType function.
 */
export function extendType(config) {
    return new NexusExtendTypeDef(config.type, Object.assign(Object.assign({}, config), { name: config.type }));
}
//# sourceMappingURL=extendType.js.map