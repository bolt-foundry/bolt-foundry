import { list } from '../definitions/list';
import { nonNull } from '../definitions/nonNull';
import { nullable } from '../definitions/nullable';
import { plugin } from '../plugin';
import { printedGenTyping } from '../utils';
import { isNexusWrappingType } from '../definitions/wrapping';
import { messages } from '../messages';
const DeclarativeWrapping = [
    printedGenTyping({
        name: 'nullable',
        type: 'boolean',
        optional: true,
        description: `\
Whether the type can be null
@default (depends on whether nullability is configured in type or schema)
@see declarativeWrappingPlugin
`,
    }),
    printedGenTyping({
        name: 'list',
        type: 'true | boolean[]',
        optional: true,
        description: `\
Whether the type is list of values, or just a single value.

If list is true, we assume the type is a list. If list is an array,
we'll assume that it's a list with the depth. The boolean indicates whether
the type is required (non-null), where true = nonNull, false = nullable.

@see declarativeWrappingPlugin
`,
    }),
    printedGenTyping({
        name: 'required',
        type: 'boolean',
        optional: true,
        description: `\
Whether the type should be non null, \`required: true\` = \`nullable: false\`
@default (depends on whether nullability is configured in type or schema)

@see declarativeWrappingPlugin
`,
    }),
];
export const declarativeWrappingPlugin = (config = {}) => {
    let hasWarned = false;
    return plugin({
        name: 'declarativeWrapping',
        fieldDefTypes: config.disable ? undefined : DeclarativeWrapping,
        argTypeDefTypes: config.disable ? undefined : DeclarativeWrapping,
        inputFieldDefTypes: config.disable ? undefined : DeclarativeWrapping,
        description: 'Provides a declarative nullable/list API, available by default pre-0.19',
        onAddOutputField(field) {
            return Object.assign(Object.assign({}, field), { type: maybeWrapType(field, config) });
        },
        onAddInputField(field) {
            return Object.assign(Object.assign({}, field), { type: maybeWrapType(field, config) });
        },
        onAddArg(arg) {
            return Object.assign(Object.assign({}, arg), { type: maybeWrapType(arg, config) });
        },
    });
    function maybeWrapType(field, config) {
        if (field.list == null && field.nullable == null && field.required == null) {
            return field.type;
        }
        const used = [];
        if (field.list != null) {
            used.push('list');
        }
        if (field.nullable != null) {
            used.push('nullable');
        }
        if (field.required != null) {
            used.push('required');
        }
        if (config.disable || config.shouldWarn) {
            const d = field;
            let location = d.configFor === 'arg'
                ? `'${d.parentType}.${d.fieldName}' field's '${d.argName}' argument`
                : `'${d.parentType}.${d.type}' field`;
            if (config.disable) {
                throw new Error(messages.removedDeclarativeWrapping(location, used));
            }
            else {
                if (hasWarned) {
                    console.warn(messages.removedDeclarativeWrappingShort(location, used));
                }
                else {
                    console.warn(messages.removedDeclarativeWrapping(location, used));
                }
            }
        }
        if (isNexusWrappingType(field.type) &&
            (field.list != null || field.nullable != null || field.required != null)) {
            let errorStr = field.configFor === 'arg'
                ? `the arg '${field.argName}' of the field '${field.parentType}.${field.fieldName}'.`
                : `the field '${field.parentType}.${field.name}'.`;
            let usedProp = field.list != null ? 'list' : field.nullable != null ? 'nullable' : 'required';
            throw new Error(`[declarativeWrappingPlugin] It looks like you used \`${usedProp}\` and wrapped the type of ` +
                errorStr +
                ' You should only do one or the other');
        }
        let type = field.type;
        if (field.list === true) {
            if (field.nullable === false || field.required === true) {
                type = nonNull(type);
            }
            type = list(type);
        }
        else if (Array.isArray(field.list)) {
            for (const isNonNull of field.list) {
                if (isNonNull === true) {
                    type = list(nonNull(type));
                }
                else {
                    type = list(nullable(type));
                }
            }
        }
        /* istanbul ignore if */
        if (field.required != null && field.nullable != null) {
            let errorSuffix = field.configFor === 'arg'
                ? ` on ${field.parentType}.${field.fieldName} arg ${field.argName}`
                : ` on ${field.parentType}.${field.name}`;
            throw new Error(`Cannot set both required & nullable wrapping modifiers on ${errorSuffix}`);
        }
        if (field.nullable === true || field.required === false) {
            type = nullable(type);
        }
        else if (field.nullable === false || field.required === true) {
            type = nonNull(type);
        }
        return type;
    }
};
//# sourceMappingURL=declarativeWrappingPlugin.js.map