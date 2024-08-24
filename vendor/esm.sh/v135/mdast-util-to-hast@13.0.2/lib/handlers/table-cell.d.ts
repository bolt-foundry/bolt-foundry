/**
 * Turn an mdast `tableCell` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {TableCell} node
 *   mdast node.
 * @returns {Element}
 *   hast node.
 */
export function tableCell(state: State, node: TableCell): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type TableCell = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').TableCell;
export type State = import('../state.d.ts').State;
