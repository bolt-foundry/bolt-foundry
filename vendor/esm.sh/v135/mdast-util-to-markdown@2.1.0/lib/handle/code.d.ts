/**
 * @param {Code} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function code(node: Code, _: Parents | undefined, state: State, info: Info): string;
export type Code = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Code;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type Map = import('../types.d.ts').Map;
export type State = import('../types.d.ts').State;
