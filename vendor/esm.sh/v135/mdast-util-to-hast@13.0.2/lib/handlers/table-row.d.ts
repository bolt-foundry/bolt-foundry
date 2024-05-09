/**
 * Turn an mdast `tableRow` node into hast.
 *
 * @param {State} state
 *   Info passed around.
 * @param {TableRow} node
 *   mdast node.
 * @param {Parents | undefined} parent
 *   Parent of `node`.
 * @returns {Element}
 *   hast node.
 */
export function tableRow(state: State, node: TableRow, parent: Parents | undefined): Element;
export type Element = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Element;
export type ElementContent = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').ElementContent;
export type Properties = import('https://esm.sh/v135/@types/hast@3.0.3/index.d.ts').Properties;
export type Parents = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').Parents;
export type TableRow = import('https://esm.sh/v135/@types/mdast@4.0.3/index.d.ts').TableRow;
export type State = import('../state.d.ts').State;
