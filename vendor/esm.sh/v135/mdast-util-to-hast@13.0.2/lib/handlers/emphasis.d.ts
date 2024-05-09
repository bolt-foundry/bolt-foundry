/**
 * Turn an mdast `emphasis` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Emphasis} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function emphasis(state: State, node: Emphasis): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Emphasis = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Emphasis;
export type State = import('../state.d.ts').State;
