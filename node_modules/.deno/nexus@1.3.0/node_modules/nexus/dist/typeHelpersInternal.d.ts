/**
 * Borrowed from `type-fest`
 *
 * Extract the keys from a type where the value type of the key extends the given `Condition`.
 */
export declare type ConditionalKeys<Base, Condition> = NonNullable<{
    [Key in keyof Base]: Condition extends Base[Key] ? Key : never;
}[keyof Base]>;
/**
 * Taken from `type-fest`
 *
 * Pick keys from the shape that matches the given `Condition`.
 */
export declare type ConditionalPick<Base, Condition> = Pick<Base, ConditionalKeys<Base, Condition>>;
/**
 * Taken from `type-fest`
 *
 * Get the values of a mapped types
 */
export declare type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];
/** Is the given type equal to the other given type? */
export declare type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
export declare type RequiredDeeply<T> = DoRequireDeeply<Exclude<T, undefined>>;
/**
 * Represents a POJO. Prevents from allowing arrays and functions.
 *
 * @remarks
 *   TypeScript interfaces will not be considered sub-types.
 */
export declare type PlainObject = {
    [x: string]: Primitive | object;
};
/** Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive). */
export declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
declare type DoRequireDeeply<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined> extends PlainObject ? DoRequireDeeply<Exclude<T[K], undefined>> : Exclude<T[K], undefined>;
};
export declare type MaybePromiseLike<T> = T | PromiseLike<T>;
export declare type UnwrapPromise<R> = R extends PromiseLike<infer U> ? U : R;
export {};
