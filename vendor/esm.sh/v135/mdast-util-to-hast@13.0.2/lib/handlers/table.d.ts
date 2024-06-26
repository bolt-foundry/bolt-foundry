/**
 * Turn an mdast `table` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {Table} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function table(state: State, node: Table): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type Table = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Table;
export type State = import('../state.d.ts').State;
