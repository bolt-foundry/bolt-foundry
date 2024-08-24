/**
 * @param {Link} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function link(node: Link, _: Parents | undefined, state: State, info: Info): string;
export namespace link {
    export { linkPeek as peek };
}
export type Link = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Link;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Exit = import('../types.d.ts').Exit;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
/**
 * @param {Link} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @returns {string}
 */
declare function linkPeek(node: Link, _: Parents | undefined, state: State): string;
export {};
