/**
 * @param {LinkReference} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function linkReference(node: LinkReference, _: Parents | undefined, state: State, info: Info): string;
export namespace linkReference {
    export { linkReferencePeek as peek };
}
export type LinkReference = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').LinkReference;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
/**
 * @returns {string}
 */
declare function linkReferencePeek(): string;
export {};
