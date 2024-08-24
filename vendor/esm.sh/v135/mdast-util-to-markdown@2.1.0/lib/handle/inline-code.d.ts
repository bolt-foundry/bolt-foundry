/**
 * @param {InlineCode} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @returns {string}
 */
export function inlineCode(node: InlineCode, _: Parents | undefined, state: State): string;
export namespace inlineCode {
    export { inlineCodePeek as peek };
}
export type InlineCode = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').InlineCode;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type State = import('../types.d.ts').State;
/**
 * @returns {string}
 */
declare function inlineCodePeek(): string;
export {};
