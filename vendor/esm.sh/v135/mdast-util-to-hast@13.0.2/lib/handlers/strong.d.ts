/**
 * Turn an mdast `strong` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Strong} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function strong(state: State, node: Strong): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Strong = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Strong;
export type State = import('../state.d.ts').State;
