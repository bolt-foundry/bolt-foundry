/**
 * Turn an mdast `list` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {List} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function list(state: State, node: List): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Properties = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Properties;
export type List = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').List;
export type State = import('../state.d.ts').State;
