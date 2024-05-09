/**
 * @typedef {import('mdast').Parents} Parents
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').Info} Info
 * @typedef {import('../types.js').State} State
 */
/**
 * @param {Text} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function text(node: Text, _: Parents | undefined, state: State, info: Info): string;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Text = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Text;
export type Info = import('../types.d.ts').Info;
export type State = import('../types.d.ts').State;
