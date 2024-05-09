/**
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('mdast').Parents} Parents
 * @typedef {import('../types.js').Info} Info
 * @typedef {import('../types.js').Map} Map
 * @typedef {import('../types.js').State} State
 */
/**
 * @param {Blockquote} node
 * @param {Parents | undefined} _
 * @param {State} state
 * @param {Info} info
 * @returns {string}
 */
export function blockquote(node: Blockquote, _: Parents | undefined, state: State, info: Info): string;
export type Blockquote = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Blockquote;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type Info = import('../types.d.ts').Info;
export type Map = import('../types.d.ts').Map;
export type State = import('../types.d.ts').State;
