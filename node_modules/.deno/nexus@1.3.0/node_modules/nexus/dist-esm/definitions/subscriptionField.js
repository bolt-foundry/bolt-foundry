import { extendType } from './extendType';
export function subscriptionField(...args) {
    return extendType({
        type: 'Subscription',
        definition(t) {
            if (typeof args[0] === 'function') {
                return args[0](t);
            }
            const [fieldName, config] = args;
            const finalConfig = typeof config === 'function' ? config() : config;
            t.field(fieldName, finalConfig);
        },
    });
}
//# sourceMappingURL=subscriptionField.js.map