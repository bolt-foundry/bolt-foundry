/**
 * Turn an mdast `blockquote` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Blockquote} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function blockquote(state: State, node: Blockquote): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Blockquote = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Blockquote;
export type State = import('../state.d.ts').State;
