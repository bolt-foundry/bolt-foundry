/**
 * Helper for implementing ADT `is` functions.
 *
 * @remarks This looks for a `.symbol` property on the given value and if it exists checks if it matches the given symbol.
 *
 * This is how nominal-like typing is achieved with the ADTs.
 */
export const is = (value, symbol) => {
    // TODO waiting for https://github.com/Microsoft/TypeScript/issues/21732
    return (typeof value === `object` &&
        value !== null &&
        `_` in value &&
        // eslint-disable-next-line
        typeof value._ === `object` &&
        // eslint-disable-next-line
        value._ !== null &&
        // eslint-disable-next-line
        typeof value._.symbol === `symbol` &&
        // eslint-disable-next-line
        value._.symbol === symbol);
};
//# sourceMappingURL=helpers.js.map