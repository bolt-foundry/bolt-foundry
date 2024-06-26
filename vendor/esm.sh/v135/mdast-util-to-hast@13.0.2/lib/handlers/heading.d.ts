/**
 * Turn an mdast `heading` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Heading} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function heading(state: State, node: Heading): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Heading = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Heading;
export type State = import('../state.d.ts').State;
