/**
 * @param {Root} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function root(node: Root, _: Parents | undefined, state: State, info: Info): string;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Root = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Root;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
