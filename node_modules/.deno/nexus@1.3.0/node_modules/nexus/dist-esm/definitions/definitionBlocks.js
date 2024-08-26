import { messages } from '../messages';
/** The output definition block is passed to the "definition" function property of the "objectType" / "interfaceType" */
export class OutputDefinitionBlock {
    constructor(typeBuilder, wrapping) {
        this.typeBuilder = typeBuilder;
        this.wrapping = wrapping;
        this.typeName = typeBuilder.typeName;
        this.typeBuilder.addDynamicOutputMembers(this, this.wrapping);
    }
    /**
     * [API Docs](https://nxs.li/docs/api/list) | [GraphQL 2018
     * Spec](https://spec.graphql.org/June2018/#sec-Type-System.List)
     *
     * Chain this property to wrap the right-hand-side type (the field type, another list, nonNull, etc.) with a
     * List type.
     *
     * Chains are read backwards, right to left, like function composition. In other words the thing on the left
     * wraps the thing on the right.
     *
     * This is a shorthand equivalent to:
     *
     * `t.field('...', { type: list('...') })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.list.nonNull.string('aliases')
     *     },
     *   })
     *
     *   // GraphQL SDL
     *   // -----------
     *   //
     *   // type User {
     *   //   aliases: [String!]
     *   // }
     */
    get list() {
        return this._wrapClass('List');
    }
    /**
     * [API Docs](https://nxs.li/docs/api/nonNull) | [Nullability
     * Guide](https://nexusjs.org/docs/guides/nullability) | [GraphQL 2018
     * Spec](https://spec.graphql.org/June2018/#sec-Type-System.Non-Null)
     *
     * Chain this property to wrap the right-hand-side type (the field type or a list) with a Non-Null type.
     *
     * In Nexus output types are nullable by default so this is useful to configure a field differently. Note if
     * you find yourself using this most of the time then what you probably what is to change the
     * nonNullDefaults configuration either globally in your makeSchema config or at the type definition level
     * in one of your type configs to be false for outputs.
     *
     * Chains are read backwards, right to left, like function composition. In other words the thing on the left
     * wraps the thing on the right.
     *
     * This is a shorthand equivalent to:
     *
     * `t.field('...', { type: nonNull('...') })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.nonNull.list.string('aliases')
     *     },
     *   })
     *
     *   // GraphQL SDL
     *   // -----------
     *   //
     *   // type User {
     *   //   aliases: [String]!
     *   // }
     */
    get nonNull() {
        return this._wrapClass('NonNull');
    }
    /**
     * [API Docs](https://nxs.li/docs/api/null) | [Nullability
     * Guide](https://nexusjs.org/docs/guides/nullability) | [GraphQL 2018
     * Spec](https://spec.graphql.org/June2018/#sec-Type-System.Non-Null)
     *
     * Chain this property to *unwrap* the right-hand-side type (the field type or a list) of a Non-Null type.
     *
     * In Nexus output types are nullable by default so this is only useful when you have changed your
     * nonNullDefaults configuration either globally in your makeSchema config or at the type definition level
     * in one of your type configs to be false for outputs.
     *
     * Chains are read backwards, right to left, like function composition. In other words the thing on the left
     * wraps the thing on the right.
     *
     * This is a shorthand equivalent to:
     *
     * `t.field('...', { type: nullable('...') })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     nonNullDefaults: {
     *       outputs: true,
     *     },
     *     definition(t) {
     *       t.id('id')
     *       t.nullable.string('bio')
     *     },
     *   })
     *
     *   // GraphQL SDL
     *   // -----------
     *   //
     *   // type User {
     *   //   id: ID!
     *   //   bio: String
     *   // }
     */
    get nullable() {
        return this._wrapClass('Null');
    }
    /**
     * [GraphQL 2018 spec](https://spec.graphql.org/June2018/#sec-Boolean)
     *
     * Define a field whose type is Boolean.
     *
     * Boolean types are [scalars](https://spec.graphql.org/June2018/#sec-Scalars) representing true or false.
     * They are represented in JavaScript using the [boolean primitive
     * type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean).
     *
     * This is a shorthand equivalent to:
     *
     * `t.field('...', { type: boolean() })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.boolean('active')
     *     },
     *   })
     *
     * @param name The name of this field. Must conform to the regex pattern: [_A-Za-z][_0-9A-Za-z]*
     * @param config The configuration for things like the field's type, its description, its arguments, its
     *     resolver, and more. See jsdoc on each field within for details.
     *
     * This parameter is optional if no resolver is required. No resolver is required if the [source
     *     typing](https://nxs.li/guides/backing-types):
     *
     * 1. Has a field whose name matches this one 2. And whose type is compatible 3. And is a scalar
     *
     * ...in which case the default resolver will be available whose behaviour is to simply return that field
     *     from the received source type.
     */
    boolean(name, ...config) {
        this.addScalarField(name, 'Boolean', config);
    }
    /**
     * [GraphQL 2018 spec](https://spec.graphql.org/June2018/#sec-String)
     *
     * Define a field whose type is String.
     *
     * String types are [scalars](https://spec.graphql.org/June2018/#sec-Scalars) representing UTF-8 (aka.
     * unicode) character sequences. It is most often used to represent free-form human-readable text. They are
     * represented in JavaScript using the [string primitive
     * type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
     *
     * This is a shorthand, equivalent to:
     *
     * `t.field('...', { type: string() })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.string('bio')
     *     },
     *   })
     *
     * @param name The name of this field. Must conform to the regex pattern: [_A-Za-z][_0-9A-Za-z]*
     * @param config The configuration for things like the field's type, its description, its arguments, its
     *     resolver, and more. See jsdoc on each field within for details.
     *
     * This parameter is optional if no resolver is required. No resolver is required if the [source
     *     typing](https://nxs.li/guides/backing-types):
     *
     * 1. Has a field whose name matches this one 2. And whose type is compatible 3. And is a scalar
     *
     * ...in which case the default resolver will be available whose behaviour is to simply return that field
     *     from the received source type.
     */
    string(name, ...config) {
        this.addScalarField(name, 'String', config);
    }
    /**
     * [GraphQL 2018 spec](https://spec.graphql.org/June2018/#sec-ID)
     *
     * Define a field whose type is ID.
     *
     * ID types are [scalars](https://spec.graphql.org/June2018/#sec-Scalars) representing unique identifiers
     * often used to refetch an object or as the key for a cache. It is serialized in the same way as the
     * [String](https://spec.graphql.org/June2018/#sec-String) type but unlike String not intended to be
     * human-readable. They are represented in JavaScript using the [string primitive
     * type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String).
     *
     * This is a shorthand, equivalent to:
     *
     * `t.field('...', { type: id() })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.id('id')
     *     },
     *   })
     *
     * @param name The name of this field. Must conform to the regex pattern: [_A-Za-z][_0-9A-Za-z]*
     * @param config The configuration for things like the field's type, its description, its arguments, its
     *     resolver, and more. See jsdoc on each field within for details.
     *
     * This parameter is optional if no resolver is required. No resolver is required if the [source
     *     typing](https://nxs.li/guides/backing-types):
     *
     * 1. Has a field whose name matches this one 2. And whose type is compatible 3. And is a scalar
     *
     * ...in which case the default resolver will be available whose behaviour is to simply return that field
     *     from the received source type.
     */
    id(name, ...config) {
        this.addScalarField(name, 'ID', config);
    }
    /**
     * [GraphQL 2018 spec](https://spec.graphql.org/June2018/#sec-Int)
     *
     * Define a field whose type is Int.
     *
     * Int types are [scalars](https://spec.graphql.org/June2018/#sec-Scalars) representing a signed 32-bit
     * numeric non-fractional value. They are represented in JavaScript using the [number primitive
     * type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
     *
     * This is a shorthand equivalent to:
     *
     * `t.field('...', { type: int() })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.int('age')
     *     },
     *   })
     *
     * @param name The name of this field. Must conform to the regex pattern: [_A-Za-z][_0-9A-Za-z]*
     * @param config The configuration for things like the field's type, its description, its arguments, its
     *     resolver, and more. See jsdoc on each field within for details.
     *
     * This parameter is optional if no resolver is required. No resolver is required if the [source
     *     typing](https://nxs.li/guides/backing-types):
     *
     * 1. Has a field whose name matches this one 2. And whose type is compatible 3. And is a scalar
     *
     * ...in which case the default resolver will be available whose behaviour is to simply return that field
     *     from the received source type.
     */
    int(name, ...config) {
        this.addScalarField(name, 'Int', config);
    }
    /**
     * [GraphQL 2018 spec](https://spec.graphql.org/June2018/#sec-Float)
     *
     * Define a field whose type is Float.
     *
     * Float types are [scalars](https://spec.graphql.org/June2018/#sec-Scalars) representing signed
     * double‐precision fractional values as specified by IEEE 754. They are represented in JavaScript using
     * the [number primitive
     * type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
     *
     * This is a shorthand, equivalent to:
     *
     * `t.field('...', { type: float() })`
     *
     * @example
     *   objectType({
     *     name: 'User',
     *     definition(t) {
     *       t.float('height')
     *     },
     *   })
     *
     * @param name The name of this field. Must conform to the regex pattern: [_A-Za-z][_0-9A-Za-z]*
     * @param config The configuration for things like the field's type, its description, its arguments, its
     *     resolver, and more. See jsdoc on each field within for details.
     *
     * This parameter is optional if no resolver is required. No resolver is required if the [source
     *     typing](https://nxs.li/guides/backing-types):
     *
     * 1. Has a field whose name matches this one 2. And whose type is compatible 3. And is a scalar
     *
     * ...in which case the default resolver will be available whose behaviour is to simply return that field
     *     from the received source type.
     */
    float(name, ...config) {
        this.addScalarField(name, 'Float', config);
    }
    field(...args) {
        const config = args.length === 2 ? Object.assign({ name: args[0] }, args[1]) : args[0];
        this.typeBuilder.addField(Object.assign(Object.assign({}, config), { configFor: 'outputField', wrapping: this.wrapping, parentType: this.typeName }));
    }
    _wrapClass(kind) {
        var _a;
        const previousWrapping = (_a = this.wrapping) === null || _a === void 0 ? void 0 : _a[0];
        if ((kind === 'NonNull' || kind === 'Null') &&
            (previousWrapping === 'NonNull' || previousWrapping === 'Null')) {
            return new OutputDefinitionBlock(this.typeBuilder, this.wrapping || []);
        }
        return new OutputDefinitionBlock(this.typeBuilder, [kind].concat(this.wrapping || []));
    }
    addScalarField(fieldName, typeName, opts) {
        let fieldConfig = {
            type: typeName,
        };
        /* istanbul ignore if */
        if (typeof opts[0] === 'function') {
            throw new Error(messages.removedFunctionShorthand(typeName, fieldName));
        }
        else {
            fieldConfig = Object.assign(Object.assign({}, fieldConfig), opts[0]);
        }
        this.field(fieldName, fieldConfig);
    }
}
export class InputDefinitionBlock {
    constructor(typeBuilder, wrapping) {
        this.typeBuilder = typeBuilder;
        this.wrapping = wrapping;
        this.typeName = typeBuilder.typeName;
        this.typeBuilder.addDynamicInputFields(this, this.wrapping);
    }
    get list() {
        return this._wrapClass('List');
    }
    get nonNull() {
        return this._wrapClass('NonNull');
    }
    get nullable() {
        return this._wrapClass('Null');
    }
    string(fieldName, config) {
        this.field(fieldName, Object.assign(Object.assign({}, config), { type: 'String' }));
    }
    int(fieldName, config) {
        this.field(fieldName, Object.assign(Object.assign({}, config), { type: 'Int' }));
    }
    boolean(fieldName, opts) {
        this.field(fieldName, Object.assign(Object.assign({}, opts), { type: 'Boolean' }));
    }
    id(fieldName, config) {
        this.field(fieldName, Object.assign(Object.assign({}, config), { type: 'ID' }));
    }
    float(fieldName, config) {
        this.field(fieldName, Object.assign(Object.assign({}, config), { type: 'Float' }));
    }
    field(...args) {
        const config = args.length === 2 ? Object.assign({ name: args[0] }, args[1]) : args[0];
        this.typeBuilder.addField(Object.assign(Object.assign({}, config), { wrapping: this.wrapping, parentType: this.typeName, configFor: 'inputField' }));
    }
    _wrapClass(kind) {
        var _a;
        const previousWrapping = (_a = this.wrapping) === null || _a === void 0 ? void 0 : _a[0];
        if ((kind === 'NonNull' || kind === 'Null') &&
            (previousWrapping === 'NonNull' || previousWrapping === 'Null')) {
            return new InputDefinitionBlock(this.typeBuilder, this.wrapping || []);
        }
        return new InputDefinitionBlock(this.typeBuilder, [kind].concat(this.wrapping || []));
    }
}
//# sourceMappingURL=definitionBlocks.js.map