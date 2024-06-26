/**
 * @param {List} node
 * @param {Parents | undefined} parent
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function list(node: List, parent: Parents | undefined, state: State, info: Info): string;
export type List = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').List;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
