/**
 * @param {Definition} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function definition(node: Definition, _: Parents | undefined, state: State, info: Info): string;
export type Definition = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Definition;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
