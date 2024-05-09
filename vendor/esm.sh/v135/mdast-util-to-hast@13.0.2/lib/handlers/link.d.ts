/**
 * Turn an mdast `link` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Link} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function link(state: State, node: Link): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Properties = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Properties;
export type Link = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Link;
export type State = import('../state.d.ts').State;
