/**
 * @param {Emphasis} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function emphasis(node: Emphasis, _: Parents | undefined, state: State, info: Info): string;
export namespace emphasis {
    export { emphasisPeek as peek };
}
export type Emphasis = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Emphasis;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
/**
 * @param {Emphasis} _
 * @param {Parents | undefined} _1
 * @param {State} state
 * @returns {string}
 */
declare function emphasisPeek(_: Emphasis, _1: Parents | undefined, state: State): string;
export {};
